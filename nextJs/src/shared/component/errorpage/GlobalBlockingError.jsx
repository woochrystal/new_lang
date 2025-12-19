'use client';

import { useEffect, useState } from 'react';
import { useBlockingErrorStore } from '@/shared/store/blockingErrorStore';
import { BlockingError } from './BlockingError';

/**
 * blockingErrorStore를 구독하여 BlockingError를 자동으로 렌더링합니다.
 * providers.jsx의 최상위에 추가하여 사용합니다.
 *
 * @returns {React.ReactNode}
 */
export const GlobalBlockingError = () => {
  const blockingError = useBlockingErrorStore((state) => state.blockingError);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !blockingError) return null;

  return (
    <BlockingError
      type={blockingError.type}
      title={blockingError.title}
      message={blockingError.message}
      onRetry={blockingError.onRetry}
      retryText={blockingError.retryText}
    />
  );
};

export default GlobalBlockingError;
