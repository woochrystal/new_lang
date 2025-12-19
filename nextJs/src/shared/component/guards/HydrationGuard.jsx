/*
 * 변경 이력:
 * 2025-11-11: Hydration 타임아웃 3초 → 500ms로 단축 (비정상 환경 UX 개선)
 * 2025-11-11: 3초 강제 타임아웃 안전장치 추가 (localStorage 접근 실패 대비)
 */
'use client';

import { useEffect, useState } from 'react';
import { useTokenStore } from '@/shared/store';
import { LoggerFactory } from '@/shared/lib';

const logger = LoggerFactory.getLogger('HydrationGuard');

/**
 * Hydration Guard
 *
 * 역할: Zustand store의 localStorage hydration이 완료될 때까지
 * 자식 컴포넌트 렌더링을 보류하는 보호 컴포넌트
 *
 * 필요성:
 * - API 클라이언트가 tokenStore를 Single Source of Truth로 신뢰하기 위해
 * - localStorage에서 hydration이 완료되지 않은 상태에서 렌더링되는 것을 방지
 * - 경쟁 상태로 인한 오래된 토큰 사용 문제 근본 차단
 *
 * 사용법:
 * <HydrationGuard>
 *   <YourApp />
 * </HydrationGuard>
 */
export default function HydrationGuard({ children }) {
  const [isHydrated, setIsHydrated] = useState(false);
  const _hasHydrated = useTokenStore((state) => state._hasHydrated);

  useEffect(() => {
    // hydration이 완료되었는지 확인
    if (_hasHydrated) {
      setIsHydrated(true);
      return;
    }

    // 500ms 후 강제 진행 (localStorage 접근 실패 대비)
    const timeout = setTimeout(() => {
      const tokenState = useTokenStore.getState();
      const hasValidTokens = tokenState.hasValidTokens();

      if (!hasValidTokens) {
        logger.warn('[HydrationGuard] Hydration timeout without valid tokens - rendering in unauthenticated state');
      } else {
        logger.info('[HydrationGuard] Hydration timeout but tokens are valid - rendering');
      }

      setIsHydrated(true);
    }, 500);

    return () => clearTimeout(timeout);
  }, [_hasHydrated]);

  // hydration이 완료될 때까지 렌더링 보류
  if (!isHydrated) {
    // 최소한의 UI만 표시 (선택사항)
    // 필요하면 로딩 스핀너를 표시할 수 있음
    return null;
  }

  return children;
}
