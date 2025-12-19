'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';

import { inquiryApi } from '../script/api';
import { useAuth } from '@/shared/auth';
import { useApi } from '@/shared/hooks';
import { Button, Input, Editor, RenderGuard } from '@/shared/component';
import { useAlertStore } from '@/shared/store';
import { FileTr } from '@/features/aprv';
import tableStyles from '@/shared/ui/Table/table.module.scss'; // tableStyles import

/**
 * 문의 등록/수정 폼 컴포넌트
 */
const InquiryForm = function ({ mode = 'create', inquiryId, onSuccess, onCancel }) {
  const isEditMode = mode === 'edit'; // 문의는 수정 기능이 없으므로 항상 'create' 모드
  const { showError, showConfirm } = useAlertStore();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    inqTitle: '',
    inqCtt: '',
    fileState: {
      fileId: null,
      existing: [],
      new: [],
      deletedIds: []
    }
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 문의는 수정 기능이 없으므로, 기존 데이터 로딩은 필요 없음.
  // 다만, 혹시 모를 재사용성을 위해 useApi 훅은 남겨두되, 호출은 하지 않음.
  const { data: apiData, isLoading: apiLoading } = useApi(
    () => (isEditMode && inquiryId ? inquiryApi.getMyInquiryById(inquiryId) : Promise.resolve(null)),
    [isEditMode, inquiryId]
  );

  // 문의는 생성만 가능하므로, canEditOrDelete는 항상 true (생성 권한은 로그인 여부로 판단)
  const canCreate = useMemo(() => {
    return !!user; // 로그인 되어 있으면 생성 가능
  }, [user]);

  useEffect(() => {
    // 문의는 수정 기능이 없으므로, 이 부분은 비워둠.
    // 만약 수정 기능이 추가된다면 apiData를 기반으로 formData를 설정.
  }, [isEditMode, apiData]);

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
    if (!formData.inqTitle.trim()) {
      newErrors.inqTitle = '제목을 입력해주세요.';
    }
    if (!formData.inqCtt.trim()) {
      newErrors.inqCtt = '내용을 입력해주세요.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canCreate) {
      showError({ title: '권한 없음', message: '문의를 등록할 권한이 없습니다.' });
      return;
    }
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      let success = false;
      const payload = {
        inqTitle: formData.inqTitle,
        inqCtt: formData.inqCtt
      };

      // 문의는 현재 생성만 가능
      success = await inquiryApi.createInquiry(payload, formData.fileState);

      if (success && onSuccess) {
        onSuccess();
      }
    } catch (err) {
      showError({ message: err.message || '문의 등록에 실패했습니다.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 문의는 삭제 기능이 없으므로, handleDelete는 필요 없음.
  // 만약 삭제 기능이 추가된다면 구현.

  if (apiLoading) {
    return <div>데이터를 불러오는 중...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex items-end gap-4">
        <div className="flex-1">
          <Input
            label="제목"
            placeholder="제목을 입력하세요"
            value={formData.inqTitle}
            onChange={(e) => handleInputChange('inqTitle', e.target.value)}
            error={errors.inqTitle}
            disabled={!canCreate}
          />
        </div>
      </div>

      <div>
        <Editor
          key={inquiryId || 'create'}
          content={formData.inqCtt}
          onChange={(value) => handleInputChange('inqCtt', value)}
          placeholder="내용을 입력하세요..."
          editable={canCreate}
        />
        {errors.inqCtt && <p className="mt-1 text-sm text-red-600">{errors.inqCtt}</p>}

        {/* 첨부파일영역 */}
        <div className={'hasItem03'}>
          <div className={`${tableStyles.postInfoBox} postInfoBox`}>
            <table className={tableStyles.table}>
              <tbody>
                <FileTr
                  id="inquiry-files"
                  label="파일첨부"
                  fileState={formData.fileState}
                  onChange={handleFilesChange}
                  multiple={true}
                  disabled={!canCreate}
                />
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="flex justify-end items-center mt-4">
        {' '}
        {/* 삭제 버튼 제거, 오른쪽 정렬 */}
        <div className="flex gap-2">
          <Button type="button" variant="secondary" onClick={onCancel} disabled={isSubmitting}>
            취소
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting || !canCreate}>
            {isSubmitting ? '저장 중...' : '등록'}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default InquiryForm;
