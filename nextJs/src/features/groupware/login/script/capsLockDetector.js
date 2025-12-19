'use client';

import { useState, useEffect } from 'react';

import { LoggerFactory } from '@/shared/lib';

const logger = LoggerFactory.getLogger('CapsLockDetector');

/**
 * 캡스락 감지 훅
 * @returns {Object} { capsLockOn, checkCapsLock, resetCapsLock }
 */
export const useCapsLockDetector = () => {
  const [capsLockOn, setCapsLockOn] = useState(false);

  // 전역 키보드 이벤트 리스너
  useEffect(() => {
    const handleGlobalKeyDown = (event) => {
      if (event.getModifierState) {
        const currentCapsState = event.getModifierState('CapsLock');
        // 상태가 변경된 경우에만 업데이트

        setCapsLockOn(currentCapsState);

        // 다른 위치의 구조에서 보여지지 않아 수정
        // if (currentCapsState !== capsLockOn) {
        //   logger.info('CapsLock 상태 변경: {}', currentCapsState);
        //   setCapsLockOn(currentCapsState);
        // }
      } else {
        logger.warn('getModifierState를 지원하지 않는 브라우저입니다');
      }
    };
    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => {
      document.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, []);

  // 캡스락 상태 리셋
  const resetCapsLock = () => {
    setCapsLockOn(false);
  };

  return {
    capsLockOn,
    resetCapsLock
  };
};
