'use client';

import { useEffect, useMemo, useState } from 'react';

import { Label, Modal, Textarea } from '@/shared/component';
import { validateApprovalComment } from '@/features/aprv';

/**
 * 결재 승인/반려 의견 입력 모달 컴포넌트
 * @param {Object} props
 * @param {boolean} props.isOpen - 모달 오픈 여부
 * @param {'approve'|'reject'} props.type - 모달 타입 (승인/반려)
 * @param {Function} props.onSubmit - 제출 핸들러 (comment) => void
 * @param {Function} props.onClose - 닫기 핸들러
 * @param {boolean} [props.isSubmitting=false] - 제출 중 상태
 */
const ApprovalCommentModal = ({ isOpen, type, onSubmit, onClose, isSubmitting = false }) => {
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  // 타입별 설정 (승인/반려에 따른 텍스트 및 동작)
  const config = useMemo(
    () => ({
      approve: {
        title: '결재 승인',
        buttonText: '승인',
        buttonVariant: 'primary',
        placeholder: '승인 의견을 입력하세요 (선택)',
        required: false
      },
      reject: {
        title: '결재 반려',
        buttonText: '반려',
        buttonVariant: 'warning',
        placeholder: '반려 사유를 입력하세요',
        required: true
      }
    }),
    []
  );

  const currentConfig = config[type];

  // 모달이 열릴 때마다 초기화
  useEffect(() => {
    if (isOpen) {
      setComment('');
      setError('');
    }
  }, [isOpen]);

  // 입력 변경 핸들러
  const handleChange = (e) => {
    const value = e.target.value;
    setComment(value);

    // 검증
    const validation = validateApprovalComment(type, value);
    setError(validation.error || '');
  };

  // 제출 핸들러
  const handleSubmit = () => {
    // 최종 검증 (Zod 스키마 사용)
    const validation = validateApprovalComment(type, comment);
    if (!validation.isValid) {
      setError(validation.error || '');
      return;
    }

    onSubmit(comment);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={currentConfig.title}
      showFooter={true}
      confirmText={currentConfig.buttonText}
      cancelText={'취소'}
      onConfirm={handleSubmit}
    >
      <div>
        <Label htmlFor="comment" required={!!currentConfig.required}>
          결재 의견
        </Label>
        <Textarea
          id="comment"
          value={comment}
          onChange={handleChange}
          placeholder={currentConfig.placeholder}
          required={currentConfig.required}
          disabled={isSubmitting}
          error={error}
        />
      </div>
    </Modal>
  );
};

export default ApprovalCommentModal;
