'use client';

import React, { useState, useEffect } from 'react';
import { PositionApi } from '@/features/pos';
import styles from './Position.module.scss';
import { validateExampleForm } from '@/features/pos/script/schema';
import { Input } from '@/shared/component';

const PositionCreate = function ({ onCreateSuccess, onSaveHandlerReady }) {
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    posNm: '',
    posOrd: ''
  });
  const [errors, setErrors] = useState({});

  const handleSave = async function () {
    const validation = validateExampleForm(formData);

    if (!validation.success) {
      setErrors(validation.errors);
      console.error('유효성 검증 실패:', validation.errors);
      return;
    }

    setSaving(true);

    try {
      const result = await PositionApi.create(formData);

      if (result) {
        if (onCreateSuccess) onCreateSuccess();
      }
    } catch (error) {
      console.error('직급 등록 중 오류 발생:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = function (field, value) {
    setFormData({ ...formData, [field]: value });

    // 실시간 에러 제거
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  // 저장 핸들러를 부모에게 전달
  useEffect(() => {
    if (onSaveHandlerReady) {
      onSaveHandlerReady(handleSave);
    }
  }, [formData, onSaveHandlerReady]);

  return (
    <div className={styles.positionDetailModal}>
      <div className={styles.formGrid}>
        <div className={styles.formRow}>
          <Input
            label="직급명"
            type="text"
            placeholder="직급명 입력"
            value={formData.posNm}
            onChange={(e) => handleInputChange('posNm', e.target.value)}
            disabled={saving}
            required
          />
          {errors.posNm && <div className={styles.fieldError}>{errors.posNm}</div>}
        </div>

        <div className={styles.formRow}>
          <Input
            label="정렬 순서"
            type="number"
            placeholder="정렬 순서 입력"
            value={formData.posOrd}
            onChange={(e) => handleInputChange('posOrd', e.target.value)}
            disabled={saving}
          />
          {errors.posOrd && <div className={styles.fieldError}>{errors.posOrd}</div>}
        </div>
      </div>
    </div>
  );
};

export default PositionCreate;
