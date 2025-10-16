'use client';

import { RouteGuard } from '@/shared/ui/Guards/RouteGuard';
import Top from '@/shared/ui/Title/TopTit';

const title = '기업 맞춤형 IT 솔루션, 펜타웨어';

export default function TestLayout02({ children }) {
  return (
    <RouteGuard requiredPermissions={['vacation.read']} fallback={<div>휴가 권한 확인 중...</div>}>
      <div className="innerLayout">
        <Top title={title} />
        {children}
      </div>
    </RouteGuard>
  );
}
