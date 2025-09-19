'use client';

import { RouteGuard } from '@/shared/ui/Guards/RouteGuard';
import { Loading } from '@/shared/ui/Loading/Loading';
import LeftMenu from '@/shared/ui/LeftMenu/LeftMenu';
// import './layout.scss';

// 페이지 내부 컨텐츠 레이아웃
export default function ContentLayout({ children }) {
  return (
    <RouteGuard
      requiredPermissions={[]}
      fallback={<Loading message="로그인 확인 중..." size="large" fullscreen={true} />}
    >
      <main className="main">
        <div className="containWrap">
          <LeftMenu />
          {children}
        </div>
      </main>
    </RouteGuard>
  );
}
