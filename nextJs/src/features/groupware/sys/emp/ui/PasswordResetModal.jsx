'use client';

import { useState, useEffect } from 'react';

import { Input, Button, Label, Modal } from '@/shared/component';
import { validatePassword } from '../script/schema';

/**
 * 비밀번호 초기화 모달 컴포넌트
 * @param {Object} props
 * @param {boolean} props.isOpen - 모달 오픈 여부
 * @param {Object} props.employee - 직원 정보 { empNo, name }
 * @param {Function} props.onSubmit - 제출 핸들러 (password) => void
 * @param {Function} props.onClose - 닫기 핸들러
 * @param {boolean} [props.isSubmitting=false] - 제출 중 상태
 */
const PasswordResetModal = function (props) {
  const { isOpen, employee, onSubmit, onClose, isSubmitting = false } = props;

  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // 모달이 열릴 때마다 초기화
  useEffect(() => {
    if (isOpen) {
      setPassword('');
      setError('');
    }
  }, [isOpen]);

  const handleChange = function (e) {
    const value = e.target.value;
    setPassword(value);

    // 실시간 유효성 검사
    if (value) {
      const validation = validatePassword(value);
      setError(validation.error || '');
    } else {
      setError('');
    }
  };

  const handleSubmit = function (e) {
    e.preventDefault();

    // 최종 유효성 검사
    const validation = validatePassword(password);
    if (!validation.success) {
      setError(validation.error);
      return;
    }

    onSubmit(password);
  };

  if (!employee) {
    return null;
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="비밀번호 초기화" variant="medium" showFooter={false}>
      <form onSubmit={handleSubmit} className="flex flex-col">
        {/* 본문 영역 */}
        <div className="px-6 py-4">
          <p className="text-sm text-gray-600 mb-6">임시 비밀번호를 설정해주세요.</p>

          <div className="flex flex-col gap-2">
            <Label htmlFor="password" className="text-sm font-medium">
              <span className="text-blue-600">*</span> 임시 비밀번호 설정
            </Label>
            <Input
              id="password"
              type="text"
              value={password}
              onChange={handleChange}
              placeholder="비밀번호를 입력하세요"
              required
              disabled={isSubmitting}
              className="w-full"
            />
            <p className="text-xs text-gray-500">최소 5자리 ~ 최대 12자리, 영문 대소문자...</p>
            {error && <span className="text-red-600 text-xs">{error}</span>}
          </div>
        </div>

        {/* 버튼 영역 */}
        <div className="flex gap-3 px-6 py-4 border-t border-gray-200">
          <Button type="submit" variant="primary" disabled={isSubmitting || !!error} className="flex-1">
            {isSubmitting ? '처리 중...' : '저장'}
          </Button>
          <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting} className="flex-1">
            취소
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default PasswordResetModal;
