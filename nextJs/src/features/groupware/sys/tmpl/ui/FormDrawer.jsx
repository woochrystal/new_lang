'use client';

import { useState, useEffect } from 'react';
import { Drawer, Input, Button, Label, Editor, Radio } from '@/shared/component';
import { useAlertStore } from '@/shared/store/alertStore';
import { tmplSchema } from '../script/schema';
import { TMPL_CONSTANTS } from '../script/constants';

/**
 * 템플릿 등록/수정 Drawer 컴포넌트
 * @param {Object} props
 * @param {boolean} props.isOpen - Drawer 열림 여부
 * @param {Function} props.onClose - Drawer 닫기 핸들러
 * @param {Object} props.initialData - 초기 데이터 (수정 시)
 * @param {boolean} props.isEditMode - 수정 모드 여부
 * @param {Function} props.onSubmit - 등록/수정 제출 핸들러
 * @param {Function} props.onDelete - 삭제 핸들러
 */
const TmplFormDrawer = function (props) {
  const { isOpen, onClose, initialData, isEditMode, onSubmit, onDelete } = props;

  const [formData, setFormData] = useState({
    code: '',
    title: '',
    content: '',
    useYn: 'Y'
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(
    function () {
      if (initialData) {
        setFormData({
          code: initialData.code || '',
          title: initialData.title || '',
          content: initialData.content || '',
          useYn: initialData.useYn || 'Y'
        });
      } else {
        setFormData({
          code: '',
          title: '',
          content: '',
          useYn: 'Y'
        });
      }
      setErrors({});
    },
    [initialData, isOpen]
  );

  const handleChange = function (field) {
    return function (e) {
      const newValue = e.target.value;
      setFormData((prev) => ({ ...prev, [field]: newValue }));
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: '' }));
      }
    };
  };

  const handleEditorChange = function (html) {
    setFormData((prev) => ({ ...prev, content: html }));
    if (errors.content) {
      setErrors((prev) => ({ ...prev, content: '' }));
    }
  };

  const handleRadioChange = function (field) {
    return function (value) {
      setFormData((prev) => ({ ...prev, [field]: value }));
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: '' }));
      }
    };
  };

  const handleSubmit = async function (e) {
    e.preventDefault();

    const validation = tmplSchema.safeParse(formData);
    if (!validation.success) {
      const fieldErrors = {};
      validation.error.issues.forEach(function (issue) {
        fieldErrors[issue.path[0]] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await onSubmit(formData);

      if (success) {
        onClose();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async function () {
    const { showConfirm } = useAlertStore.getState();
    showConfirm({
      title: '삭제 확인',
      message: '정말 삭제하시겠습니까?',
      onConfirm: async function () {
        await onDelete(initialData.id);
        onClose();
      }
    });
  };

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title={isEditMode ? '템플릿 수정' : '템플릿 등록'}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* 제목 */}
        <div>
          <Label required>제목</Label>
          <Input
            value={formData.title}
            onChange={handleChange('title')}
            placeholder="템플릿 제목을 입력하세요"
            disabled={isSubmitting}
          />
          {errors.title && <span className="text-red-600 text-sm mt-1 block">{errors.title}</span>}
        </div>

        {/* 내용 (Editor) */}
        <div>
          <Label required>내용</Label>
          <Editor content={formData.content} onChange={handleEditorChange} editable={!isSubmitting} id="tmpl-content" />
          {errors.content && <span className="text-red-600 text-sm mt-1 block">{errors.content}</span>}
        </div>

        {/* 사용여부 */}
        <div>
          <Label required>사용여부</Label>
          <Radio
            name="useYn"
            options={TMPL_CONSTANTS.USE_YN_OPTIONS}
            value={formData.useYn}
            onChange={handleRadioChange('useYn')}
            variant="button"
          />
          {errors.useYn && <span className="text-red-600 text-sm mt-1 block">{errors.useYn}</span>}
        </div>

        {/* 버튼 영역 */}
        <div className="flex gap-2 justify-end mt-4">
          {isEditMode && (
            <Button variant="danger" onClick={handleDelete} disabled={isSubmitting}>
              삭제
            </Button>
          )}
          <Button variant="primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? '처리 중...' : isEditMode ? '수정' : '등록'}
          </Button>
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            취소
          </Button>
        </div>
      </form>
    </Drawer>
  );
};

export default TmplFormDrawer;
