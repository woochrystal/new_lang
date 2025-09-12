'use client';

import { RouteGuard } from '@/shared/ui/Guards/RouteGuard';
import Top from '@/shared/ui/Title/TopTit';
import styles from './layout.module.scss';

const title = '기업 맞춤형 IT 솔루션, 펜타웨어';

export default function VacationLayout({ children }) {
  return (
    <RouteGuard requiredPermissions={['vacation.read']} fallback={<div>휴가 권한 확인 중...</div>}>
      <div className={styles.innerLayout}>
        <Top title={title} />
        {children}
      </div>
    </RouteGuard>
  );
}
