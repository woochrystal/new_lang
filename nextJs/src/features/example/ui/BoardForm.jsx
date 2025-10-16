'use client';

import { useEffect, useState } from 'react';

import { validateBoardForm, validateField } from '../script/sampleSchema';
import { BOARD_CONSTANTS } from '../script/constants';
import { LoggerFactory } from '@/shared/lib/logger';

import styles from './BoardForm.module.scss';

const logger = LoggerFactory.getLogger('BoardForm');

// ============================================================================
// Utils / Helpers
// ============================================================================

const validationHandler = (formData, content, setErrors) => () => {
  const formDataToValidate = {
    title: formData.title,
    content: content
  };
  const validation = validateBoardForm(formDataToValidate);
  setErrors(validation.errors);
  return validation.success;
};

// ============================================================================
// Event Handlers
// ============================================================================

const inputChangeHandler = (formData, setFormData, onFormDataChange, setErrors) => (field, value) => {
  const newFormData = {
    ...formData,
    [field]: value
  };
  setFormData(newFormData);

  if (onFormDataChange) {
    onFormDataChange(newFormData);
  }

  const validation = validateField(field, value);
  if (validation.success) {
    setErrors((prev) => ({ ...prev, [field]: null }));
  } else {
    setErrors((prev) => ({ ...prev, [field]: validation.error }));
  }
};

const saveHandler = (formData, content, validateForm, onSave) => async () => {
  if (!validateForm()) {
    return;
  }

  if (!onSave) {
    logger.error('onSave prop이 누락됨');
    return;
  }

  try {
    const saveData = {
      title: formData.title,
      content: content
    };
    await onSave(saveData);
  } catch (error) {
    logger.error('게시글 저장 실패: {}', error.message, error);
  }
};

// ============================================================================
// Component
// ============================================================================

/**
 * 게시글 작성/수정 폼 컴포넌트
 * @param {'create'|'edit'} props.mode - 모드 (작성/수정)
 * @param {Function} props.onSave - 저장 완료 콜백
 * @param {Object} props.initialData - 초기 데이터
 * @param {string} props.content - 에디터 내용 (외부 관리)
 * @param {boolean} props.loading - 로딩 상태
 * @param {Function} props.onFormDataChange - 폼 데이터 변경 콜백
 */
export function BoardForm({ mode = 'create', onSave, initialData, loading, content = '', onFormDataChange }) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    content: content || ''
  });
  const [errors, setErrors] = useState({});

  const validateForm = validationHandler(formData, content, setErrors);
  const handleInputChange = inputChangeHandler(formData, setFormData, onFormDataChange, setErrors);
  const handleSave = saveHandler(formData, content, validateForm, onSave);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        content: initialData.content || ''
      });
    }
  }, [initialData]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}>로딩 중...</div>
      </div>
    );
  }

  return (
    <div className={styles.boardForm}>
      {errors.general && <div className={styles.errorMessage}>{errors.general}</div>}

      <div className={styles.formSection}>
        <div className={styles.formGroup}>
          <label className={styles.label}>
            제목 <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            placeholder="게시글 제목을 입력하세요"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className={`${styles.input} ${errors.title ? styles.inputError : ''}`}
            disabled={loading}
            maxLength={BOARD_CONSTANTS.MAX_TITLE_LENGTH}
          />

          {errors.title && <div className={styles.fieldError}>{errors.title}</div>}
          <div className={styles.charCount}>
            {formData.title.length} / {BOARD_CONSTANTS.MAX_TITLE_LENGTH}자
          </div>
        </div>

        {errors.content && <div className={styles.fieldError}>{errors.content}</div>}
      </div>
    </div>
  );
}

export default BoardForm;
