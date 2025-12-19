'use client';

import { useAlertStore } from '@/shared/store';
import { Alert } from './Alert';

/**
 * 전역 에러 Alert 컴포넌트
 *
 * RootLayout에 한 번만 추가하면 모든 에러를 자동으로 표시합니다.
 * API 응답 인터셉터에서 자동으로 에러를 showError()로 표시하므로,
 * 별도의 try-catch 처리가 필요 없습니다.
 *
 * 특수한 경우(예: 폼 검증)는 showConfirm()을 직접 호출하면 됩니다.
 */
export const GlobalErrorAlert = function () {
  const error = useAlertStore((state) => state.error);
  const closeError = useAlertStore((state) => state.closeError);

  if (!error?.isOpen) {
    return null;
  }

  // isOpen을 제외하고 나머지 props만 Alert에 전달 (DOM 속성 경고 방지)
  const { isOpen, key, ...alertProps } = error;

  return <Alert key={key} {...alertProps} onClose={closeError} />;
};

export default GlobalErrorAlert;
