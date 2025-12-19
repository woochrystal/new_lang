'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';

import { noticeApi } from '../script/api';
import { useAuth } from '@/shared/auth';
import { useApi } from '@/shared/hooks';
import { Button, Input, Select, Editor, RenderGuard } from '@/shared/component';
import { useAlertStore } from '@/shared/store';
import { FileTr } from '@/features/aprv';
import styles from '@/shared/ui/Table/table.module.scss';

/**
 * 공지사항 등록/수정 폼 컴포넌트
 */
const NoticeForm = function ({ mode = 'create', noticeId, boardTy, onSuccess, onCancel }) {
  const isEditMode = mode === 'edit';
  const { showError, showConfirm } = useAlertStore();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    noticeType: boardTy || 'NOTICE', // boardTy prop으로 초기값 설정
    fileState: {
      fileId: null,
      existing: [],
      new: [],
      deletedIds: []
    }
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    data: apiData,
    isLoading: apiLoading,
    has
  } = useApi(() => (isEditMode && noticeId ? noticeApi.get(noticeId) : Promise.resolve(null)), [isEditMode, noticeId]);

  const noticeTypeOptions = useMemo(() => {
    const options = [
      { value: 'NOTICE', label: '일반공지' },
      { value: 'IMPORTANT', label: '중요공지' }
    ];
    if (user?.usrRole === 'SYSADM') {
      options.push({ value: 'SYSNOTICE', label: '시스템공지' });
    }
    return options;
  }, [user]);

  const canEditOrDelete = useMemo(() => {
    if (!isEditMode || !apiData) return true;
    if (apiData.boardTy === 'SYSNOTICE') {
      return user?.usrRole === 'SYSADM';
    }
    return ['SYSADM', 'ADM'].includes(user?.usrRole);
  }, [isEditMode, apiData, user]);

  const isSelectDisabled = useMemo(() => {
    if (boardTy) return true; // boardTy prop이 있으면 항상 비활성화
    if (!isEditMode) return false;
    if (apiData?.boardTy === 'SYSNOTICE' && user?.usrRole !== 'SYSADM') {
      return true;
    }
    return !canEditOrDelete;
  }, [isEditMode, apiData, user, canEditOrDelete, boardTy]);

  useEffect(() => {
    if (isEditMode && apiData) {
      let noticeType = 'NOTICE';
      if (apiData.boardTy === 'SYSNOTICE') {
        noticeType = 'SYSNOTICE';
      } else if (apiData.priority === 'Y') {
        noticeType = 'IMPORTANT';
      }
      setFormData({
        title: apiData.title || '',
        content: apiData.content || '',
        noticeType: noticeType,
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
        message: '이 공지사항을 수정할 권한이 없습니다.',
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
      showError({ title: '권한 없음', message: '이 공지사항을 수정할 권한이 없습니다.' });
      return;
    }
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      let success = false;
      const payload = {
        title: formData.title,
        content: formData.content,
        priority: formData.noticeType === 'IMPORTANT' ? 'Y' : 'N',
        boardTy: formData.noticeType === 'SYSNOTICE' ? 'SYSNOTICE' : 'NOTICE'
      };

      // 시스템 공지 작성 시 제목에 말머리 추가
      if (formData.noticeType === 'SYSNOTICE' && !isEditMode) {
        if (!payload.title.startsWith('[시스템 공지]')) {
          payload.title = `[시스템 공지] ${payload.title}`;
        }
      }

      if (isEditMode) {
        const updatePayload = {
          boardId: noticeId,
          title: payload.title,
          content: payload.content,
          priority: payload.priority,
          boardTy: payload.boardTy
        };
        success = await noticeApi.update(noticeId, updatePayload, formData.fileState);
      } else {
        if (payload.boardTy === 'SYSNOTICE' && user?.usrRole !== 'SYSADM') {
          showError({
            title: '권한 없음',
            message: '시스템공지는 시스템 관리자만 작성할 수 있습니다.'
          });
          setIsSubmitting(false);
          return;
        }
        success = await noticeApi.create(payload, formData.fileState);
      }

      if (success && onSuccess) {
        onSuccess();
      }
    } catch (err) {
      showError({ message: err.message || (isEditMode ? '수정' : '등록') + '에 실패했습니다.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = () => {
    if (!canEditOrDelete) {
      showError({ title: '권한 없음', message: '이 공지사항을 삭제할 권한이 없습니다.' });
      return;
    }
    showConfirm({
      title: '공지사항 삭제',
      message: `"${formData.title}"을(를) 정말로 삭제하시겠습니까?`,
      onConfirm: async () => {
        const success = await noticeApi.delete(noticeId);
        if (success && onSuccess) {
          onSuccess();
        }
      }
    });
  };

  if (apiLoading) {
    return <div>데이터를 불러오는 중...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex items-end gap-4">
        <div className="w-48">
          <Select
            label="구분"
            options={noticeTypeOptions}
            value={formData.noticeType}
            onChange={(value) => handleInputChange('noticeType', value)}
            disabled={isSelectDisabled}
          />
        </div>
        <div className="flex-1">
          <Input
            label="제목"
            placeholder="제목을 입력하세요"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            error={errors.title}
            disabled={!canEditOrDelete}
          />
        </div>
      </div>

      <div>
        <Editor
          key={noticeId || 'create'}
          content={formData.content}
          onChange={(value) => handleInputChange('content', value)}
          placeholder="내용을 입력하세요..."
          editable={!isEditMode || canEditOrDelete}
        />
        {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content}</p>}

        {/* 첨부파일영역 */}
        <div className={'hasItem03'}>
          <div className={`${styles.postInfoBox} postInfoBox`}>
            <table className={styles.table}>
              <tbody>
                <FileTr
                  id="notice-files"
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

      <div className="flex justify-between items-center mt-4">
        <div>
          {isEditMode && (
            <RenderGuard check={() => has('delete')}>
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
        </div>
        <div className="flex gap-2">
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

export default NoticeForm;
