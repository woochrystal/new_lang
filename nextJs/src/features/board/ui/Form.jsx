'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';

import { boardApi } from '../script/api';
import { useAuth } from '@/shared/auth';
import { useApi } from '@/shared/hooks';
import { Button, Input, Editor, RenderGuard, Label } from '@/shared/component';
import { useAlertStore } from '@/shared/store';
import { FileTr } from '@/features/aprv';

import styles from '@/shared/component/table/table.module.scss';
import layoutStyles from '@/shared/component/layout/layout.module.scss';

/**
 * 게시글 등록/수정 폼 컴포넌트
 */
const BoardForm = function ({ mode = 'create', boardId, onSuccess, onCancel }) {
  const isEditMode = mode === 'edit';
  const { showError, showConfirm } = useAlertStore();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    fileState: {
      fileId: null,
      existing: [],
      new: [],
      deletedIds: []
    }
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: apiData, isLoading: apiLoading } = useApi(
    () => (isEditMode && boardId ? boardApi.get(boardId) : Promise.resolve(null)),
    [isEditMode, boardId]
  );

  const canEditOrDelete = useMemo(() => {
    if (!isEditMode || !apiData || !user) return true;
    const isOwner = apiData.regId === user.usrId;
    const isAdmin = user.usrRole === 'SYSADM' || user.usrRole === 'ADM';
    return isOwner || isAdmin;
  }, [isEditMode, apiData, user]);

  useEffect(() => {
    if (isEditMode && apiData) {
      setFormData({
        title: apiData.title || '',
        content: apiData.content || '',
        fileState: {
          fileId: apiData.fileId || null,
          existing: apiData.fileList || [],
          new: [],
          deletedIds: []
        }
      });
    }
  }, [isEditMode, apiData]);

  useEffect(() => {
    if (isEditMode && apiData && !canEditOrDelete) {
      showError({
        title: '권한 없음',
        message: '이 게시글을 수정할 권한이 없습니다.',
        variant: 'error'
      });
    }
  }, [isEditMode, apiData, canEditOrDelete, showError]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleFilesChange = (newFileState) => {
    setFormData((prev) => ({
      ...prev,
      fileState: newFileState
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = '제목을 입력해주세요.';
    }
    if (!formData.content.trim()) {
      newErrors.content = '내용을 입력해주세요.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditMode && !canEditOrDelete) {
      showError({ title: '권한 없음', message: '이 게시글을 수정할 권한이 없습니다.' });
      return;
    }
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      let success = false;
      const payload = {
        title: formData.title,
        content: formData.content
      };

      if (isEditMode) {
        const updatePayload = {
          boardId: boardId,
          title: payload.title,
          content: payload.content
        };
        success = await boardApi.update(boardId, updatePayload, formData.fileState);
      } else {
        success = await boardApi.create(payload, formData.fileState);
      }

      if (success && onSuccess) {
        onSuccess(isEditMode); // 수정 모드 여부 전달
      }
    } catch (err) {
      showError({ message: err.message || (isEditMode ? '수정' : '등록') + '에 실패했습니다.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = () => {
    if (!canEditOrDelete) {
      showError({ title: '권한 없음', message: '이 게시글을 삭제할 권한이 없습니다.' });
      return;
    }
    showConfirm({
      title: '게시글 삭제',
      message: `"${formData.title}"을(를) 정말로 삭제하시겠습니까?`,
      onConfirm: async () => {
        const success = await boardApi.delete(boardId);
        if (success && onSuccess) {
          onSuccess(true); // 삭제도 수정의 일종으로 간주하여 팝업 트리거
        }
      }
    });
  };

  if (apiLoading) {
    return <div>데이터를 불러오는 중...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className={`writeStyle`}>
      <div className={layoutStyles.writeArea}>
        {/* <div>
            <div>
              <Input
                label="제목"
                placeholder="제목을 입력하세요"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                error={errors.title}
                disabled={!canEditOrDelete}
              />
            </div>
          </div> */}
        <div className={`${styles.postInfoBox} ${styles.writeInfoBox} ${styles.writeInfoTitBox}`}>
          <table className={styles.table}>
            <tbody>
              <tr>
                <th colSpan={1}>제목</th>
                <td colSpan={3} className={`${styles.postInfoInput}`}>
                  <Input
                    placeholder="제목을 입력하세요"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    error={errors.title}
                    disabled={!canEditOrDelete}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div>
          <Editor
            key={boardId || 'create'}
            content={formData.content}
            onChange={(value) => handleInputChange('content', value)}
            placeholder="내용을 입력하세요..."
            editable={!isEditMode || canEditOrDelete}
          />
          {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content}</p>}

          <div className={'hasItem03'}>
            <div className={`${styles.postInfoBox} ${styles.writeInfoBox}`}>
              <table className={styles.table}>
                <tbody>
                  <FileTr
                    id="board-files"
                    label="파일첨부"
                    fileState={formData.fileState}
                    onChange={handleFilesChange}
                    multiple={true}
                    disabled={isEditMode && !canEditOrDelete}
                  />
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className={`${layoutStyles.headerChildren} ${layoutStyles.editorBtnWrap}`}>
          {isEditMode && (
            <RenderGuard check={() => canEditOrDelete}>
              <Button
                type="button"
                variant="negative"
                onClick={handleDelete}
                disabled={isSubmitting || !canEditOrDelete}
              >
                삭제
              </Button>
            </RenderGuard>
          )}
          <Button type="button" variant="secondary" onClick={onCancel} disabled={isSubmitting}>
            취소
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting || (isEditMode && !canEditOrDelete)}>
            {isSubmitting ? '저장 중...' : isEditMode ? '수정' : '등록'}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default BoardForm;
