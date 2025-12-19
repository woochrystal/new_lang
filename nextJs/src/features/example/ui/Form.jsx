'use client';

import { useEffect, useState } from 'react';

import { Button, Input, Editor } from '@/shared/component';
import { BOARD_CONSTANTS } from '@/features/example';
import { validateField, validateExampleForm } from '../script/schema';
import { api } from '../script/api';
import { Board } from '../script/entity';
import { useAlertStore } from '@/shared/store/alertStore';

import styles from './Example.module.scss';

/**
 * 게시글 작성/수정 폼 컴포넌트
 * @param {Object} props
 * @param {'create'|'edit'} [props.mode='create'] - 모드 (작성/수정)
 * @param {number} [props.boardId] - 게시글 ID (edit 모드에서만 필요)
 * @param {Function} [props.onSuccess] - 저장 성공 후 콜백
 * @param {Function} [props.onCancel] - 취소 콜백 (선택)
 */
const ExampleForm = function (props) {
  const { mode = 'create', boardId, onSuccess, onCancel } = props;

  const [loading, setLoading] = useState(mode === 'edit');
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });
  const [errors, setErrors] = useState({});
  const [hasChanges, setHasChanges] = useState(false);

  // 초기 데이터 로드 (edit 모드)
  const fetchBoardData = async function () {
    setLoading(true);

    const result = await api.get(boardId);

    if (result) {
      const board = Board.fromApi(result);
      setFormData({
        title: board.title || '',
        content: board.content || ''
      });
    }

    setLoading(false);
  };

  // 저장
  const handleSave = async function () {
    // 유효성 검사
    const validation = validateExampleForm(formData);
    if (!validation.success) {
      setErrors(validation.errors);
      return;
    }

    setSaving(true);

    const result =
      mode === 'create'
        ? await api.create({ title: formData.title, content: formData.content })
        : await api.update(boardId, { title: formData.title, content: formData.content });

    setSaving(false);

    if (result) {
      setHasChanges(false);
      if (onSuccess) {
        onSuccess();
      }
    }
  };

  // 이벤트 핸들러
  const handleInputChange = function (field, value) {
    const newFormData = {
      ...formData,
      [field]: value
    };
    setFormData(newFormData);
    setHasChanges(true);

    // 필드 유효성 검사
    const validation = validateField(field, value);
    if (validation.success) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    } else {
      setErrors((prev) => ({ ...prev, [field]: validation.error }));
    }
  };

  const handleCancel = function () {
    if (hasChanges) {
      const { showConfirm } = useAlertStore.getState();
      showConfirm({
        title: mode === 'create' ? '작성 취소' : '수정 취소',
        message: '작성 중인 내용이 있습니다. 정말로 취소하시겠습니까?',
        onConfirm: function () {
          if (onCancel) {
            onCancel();
          } else {
            window.history.back();
          }
        },
        variant: 'warning',
        confirmText: '취소',
        cancelText: '계속 작성'
      });
    } else {
      if (onCancel) {
        onCancel();
      } else {
        window.history.back();
      }
    }
  };

  // 게시글 데이터 로드 (edit 모드)
  useEffect(
    function () {
      if (mode === 'edit' && boardId) {
        void fetchBoardData();
      }
    },
    [mode, boardId]
  );

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}>로딩 중...</div>
      </div>
    );
  }

  const isSaveDisabled = saving || !formData.title.trim() || !formData.content.trim();

  return (
    <div className={styles.ExampleForm}>
      {errors.general && <div className={styles.errorMessage}>{errors.general}</div>}

      <div className={styles.formSection}>
        {/* 제목 입력 */}
        <div className={styles.formGroup}>
          <Input
            label="제목"
            required
            type="text"
            placeholder="게시글 제목을 입력하세요"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            error={errors.title}
            disabled={saving}
            maxLength={BOARD_CONSTANTS.MAX_TITLE_LENGTH}
          />
          <div className={styles.charCount}>
            {formData.title.length} / {BOARD_CONSTANTS.MAX_TITLE_LENGTH}자
          </div>
        </div>

        {/* 내용 입력 */}
        <div className={styles.formGroup}>
          <label htmlFor="content" className={styles.label}>
            내용 <span className={styles.required}>*</span>
          </label>
          <Editor
            id="content"
            content={formData.content}
            onChange={(newContent) => handleInputChange('content', newContent)}
            placeholder="내용을 작성하세요"
          />
          {errors.content && <div className={styles.fieldError}>{errors.content}</div>}
        </div>

        {/* 버튼 영역 */}
        <div className={styles.buttonGroup}>
          <Button variant="secondary" onClick={handleCancel} disabled={saving} className={styles.cancelButton}>
            취소
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={isSaveDisabled} className={styles.saveButton}>
            {saving ? '저장 중...' : mode === 'create' ? '작성하기' : '수정하기'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExampleForm;
