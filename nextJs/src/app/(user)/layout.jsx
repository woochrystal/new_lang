'use client';

import { LeftMenu } from '@/shared/component';
import { Providers } from './providers';
// import './layout.scss';

/**
 * 페이지 내부 컨텐츠 레이아웃
 *
 * 인증/인가는 Providers의 RouteGuard가 담당합니다.
 * 이 컴포넌트는 LeftMenu와 children 영역의 레이아웃만 정의합니다.
 */
/*
 * 변경 이력:
 * 2025-11-11: RouteGuard 제거 (providers.jsx로 통합)
 *   - RouteGuard, Loading import 제거
 *   - 인증/인가는 Providers의 RouteGuard에서 처리
 *   - 레이아웃 구조만 정의 (LeftMenu + children)
 *   - 단순화된 구조로 코드 가독성 향상
 */

export default function ContentLayout({ children }) {
  return (
    <Providers>
      <main className="main">
        <div className="containWrap">
          <LeftMenu />
          {children}
        </div>
      </main>
    </Providers>
  );
}
