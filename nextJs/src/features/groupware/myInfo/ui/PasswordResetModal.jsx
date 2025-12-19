'use client';

import { useState } from 'react';

import { Modal, Button, Input } from '@/shared/component';

import styles from './PasswordResetModal.module.scss';

/**
 * 비밀번호 재설정 모달
 * @param {Object} props
 * @param {boolean} props.isOpen - 모달 열림 여부
 * @param {Function} props.onClose - 모달 닫기 핸들러
 * @param {Function} props.onSubmit - 비밀번호 변경 핸들러
 */
const PasswordResetModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // 비밀번호 유효성 검증
  const validatePassword = (password) => {
    // 10자리 이상, 영문, 숫자, 특수문자 포함
    const lengthValid = password.length >= 10;
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);

    return lengthValid && hasLetter && hasNumber && hasSpecial;
  };

  // 입력 변경 핸들러
  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));

    // 에러 초기화
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: null
      }));
    }

    // 실시간 비밀번호 확인 검증
    if (field === 'confirmPassword' && formData.newPassword) {
      if (value && value !== formData.newPassword) {
        setErrors((prev) => ({
          ...prev,
          confirmPassword: '비밀번호가 일치하지 않습니다'
        }));
      }
    }
  };

  // 제출 핸들러
  const handleSubmit = async () => {
    const newErrors = {};

    // 현재 비밀번호 검증
    if (!formData.currentPassword) {
      newErrors.currentPassword = '현재 비밀번호를 입력해주세요';
    }

    // 새 비밀번호 검증
    if (!formData.newPassword) {
      newErrors.newPassword = '새 비밀번호를 입력해주세요';
    } else if (!validatePassword(formData.newPassword)) {
      newErrors.newPassword = '최소 12자리, 영문 대소문자, 숫자를 포함해야 합니다';
    }

    // 비밀번호 확인 검증
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호 확인을 입력해주세요';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다';
    }

    // 현재 비밀번호와 새 비밀번호가 같은지 확인
    if (formData.currentPassword && formData.newPassword && formData.currentPassword === formData.newPassword) {
      newErrors.newPassword = '현재 비밀번호와 다른 비밀번호를 입력해주세요';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      await onSubmit({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword
      });
      handleClose();
    } catch (error) {
      // 현재 비밀번호 오류인 경우 필드에 에러 표시
      let isPasswordError = false;

      if (error.status === 401 || error.code === 'UNAUTHORIZED' || error.message?.includes('현재 비밀번호')) {
        setErrors((prev) => ({
          ...prev,
          currentPassword: '현재 비밀번호가 일치하지 않습니다'
        }));
        isPasswordError = true;
      } else if (error.status === 400 || error.code === 'VALIDATION_ERROR') {
        // 유효성 검증 에러인 경우 메시지 확인
        if (error.message?.includes('현재') || error.message?.includes('틀렸') || error.message?.includes('일치')) {
          setErrors((prev) => ({
            ...prev,
            currentPassword: error.message || '현재 비밀번호가 일치하지 않습니다'
          }));
          0;
          isPasswordError = true;
        }
      }

      // 현재 비밀번호 오류가 아닌 다른 에러는 부모에서 처리하도록 throw
      if (!isPasswordError) {
        throw error;
      }
    } finally {
      setLoading(false);
    }
  };

  // 모달 닫기
  const handleClose = () => {
    setFormData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal title="비밀번호 재설정" isOpen={isOpen} onClose={handleClose} showFooter={false} variant="medium">
      <div className={styles.content}>
        <p className={styles.description}>영문, 숫자, 특수 문자를 조합한 10자리로 구성해주세요.</p>

        <div className={styles.formGroup}>
          <Input
            label="현재 비밀번호"
            variant="password"
            value={formData.currentPassword}
            onChange={handleChange('currentPassword')}
            error={errors.currentPassword}
            placeholder="현재 비밀번호를 입력하세요"
          />
        </div>

        <div className={styles.formGroup}>
          <Input
            label="비밀번호 재설정"
            variant="password"
            value={formData.newPassword}
            onChange={handleChange('newPassword')}
            error={errors.newPassword}
            placeholder="새 비밀번호를 입력하세요"
          />
          {!errors.newPassword && formData.newPassword && (
            <p className={styles.hint}>최소 12자리, 영문 대소문자, 숫자를 포함하세요</p>
          )}
        </div>

        <div className={styles.formGroup}>
          <Input
            label="비밀번호 확인"
            variant="password"
            value={formData.confirmPassword}
            onChange={handleChange('confirmPassword')}
            error={errors.confirmPassword}
            placeholder="새 비밀번호를 다시 입력하세요"
          />
        </div>
      </div>

      <div className={styles.footer}>
        <Button variant="primary" onClick={handleSubmit} loading={loading} className={styles.fullWidthButton}>
          변경
        </Button>
        <Button variant="secondary" onClick={handleClose} disabled={loading} className={styles.fullWidthButton}>
          취소
        </Button>
      </div>
    </Modal>
  );
};

export default PasswordResetModal;
