'use client';

import { RouteGuard } from '@/shared/ui/Guards/RouteGuard';
import ContentLayout from '@/shared/ui/Layout/ContentLayout';
import { AccessDenied } from '@/shared/ui/ErrorPage/AccessDenied';
import styles from './layout.module.scss';

export default function ExampleLayout({ children }) {
  return (
    <RouteGuard
      requiredPermissions={['board.read']}
      fallback={
        <ContentLayout>
          <div className={styles.loadingContainer}>
            <p className={styles.loadingText}>게시판 예제 접근 권한을 확인하는 중...</p>
          </div>
        </ContentLayout>
      }
      accessDenied={
        <ContentLayout>
          <AccessDenied
            title="게시판 예제 접근 권한 없음"
            message="이 페이지에 접근하려면 'board.read' 권한이 필요합니다."
          />
          <div className={styles.accessDeniedContainer}>
            <p className={styles.accessDeniedText}>관리자에게 권한 요청을 문의하세요.</p>
          </div>
        </ContentLayout>
      }
    >
      <ContentLayout>{children}</ContentLayout>
    </RouteGuard>
  );
}
