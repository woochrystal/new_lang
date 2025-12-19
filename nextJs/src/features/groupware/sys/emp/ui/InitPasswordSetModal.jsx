/*
 * path           : features/groupware/sys/emp/ui
 * fileName       : InitPasswordSetModal.jsx
 * author         : Claude
 * date           : 2025-12-04
 * description    : 테넌트 초기 비밀번호 설정 모달
 * ===========================================================
 * DATE              AUTHOR        NOTE
 * -----------------------------------------------------------
 * 2025-12-04        Claude       최초 생성
 */
'use client';

import { useState, useEffect } from 'react';

import { Input, Button, Label, Modal } from '@/shared/component';
import { validatePassword } from '../script/schema';

/**
 * 테넌트 초기 비밀번호 설정 모달
 * @param {Object} props
 * @param {boolean} props.isOpen - 모달 오픈 여부
 * @param {Function} props.onSubmit - 제출 핸들러 (password) => void
 * @param {Function} props.onClose - 닫기 핸들러
 * @param {boolean} [props.isSubmitting=false] - 제출 중 상태
 */
const InitPasswordSetModal = function (props) {
  const { isOpen, onSubmit, onClose, isSubmitting = false } = props;

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [confirmError, setConfirmError] = useState('');

  // 모달이 열릴 때마다 초기화
  useEffect(() => {
    if (isOpen) {
      setPassword('');
      setConfirmPassword('');
      setError('');
      setConfirmError('');
    }
  }, [isOpen]);

  const handlePasswordChange = function (e) {
    const value = e.target.value;
    setPassword(value);

    // 실시간 유효성 검사
    if (value) {
      const validation = validatePassword(value);
      setError(validation.error || '');
    } else {
      setError('');
    }

    // 확인 비밀번호 일치 여부 체크
    if (confirmPassword && value !== confirmPassword) {
      setConfirmError('비밀번호가 일치하지 않습니다.');
    } else {
      setConfirmError('');
    }
  };

  const handleConfirmPasswordChange = function (e) {
    const value = e.target.value;
    setConfirmPassword(value);

    // 비밀번호 일치 여부 체크
    if (value && password !== value) {
      setConfirmError('비밀번호가 일치하지 않습니다.');
    } else {
      setConfirmError('');
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

    // 비밀번호 일치 확인
    if (password !== confirmPassword) {
      setConfirmError('비밀번호가 일치하지 않습니다.');
      return;
    }

    onSubmit(password);
  };

  const isFormValid = password && confirmPassword && !error && !confirmError;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="초기 비밀번호 설정" variant="medium" showFooter={false}>
      <form onSubmit={handleSubmit} className="flex flex-col">
        {/* 본문 영역 */}
        <div className="px-6 py-4">
          <p className="text-sm text-gray-600 mb-6">
            직원 등록 및 비밀번호 초기화 시 사용될 기본 비밀번호를 설정합니다.
          </p>

          <div className="flex flex-col gap-4">
            {/* 비밀번호 입력 */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="password" className="text-sm font-medium">
                <span className="text-blue-600">*</span> 초기 비밀번호
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={handlePasswordChange}
                placeholder="비밀번호를 입력하세요"
                required
                disabled={isSubmitting}
                className="w-full"
              />
              <p className="text-xs text-gray-500">5~12자리, 영문 대소문자, 숫자, 특수문자(!@#$%) 사용 가능</p>
              {error && <span className="text-red-600 text-xs">{error}</span>}
            </div>

            {/* 비밀번호 확인 */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium">
                <span className="text-blue-600">*</span> 비밀번호 확인
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                placeholder="비밀번호를 다시 입력하세요"
                required
                disabled={isSubmitting}
                className="w-full"
              />
              {confirmError && <span className="text-red-600 text-xs">{confirmError}</span>}
            </div>
          </div>
        </div>

        {/* 버튼 영역 */}
        <div className="flex gap-3 px-6 py-4 border-t border-gray-200">
          <Button type="submit" variant="primary" disabled={isSubmitting || !isFormValid} className="flex-1">
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

export default InitPasswordSetModal;
