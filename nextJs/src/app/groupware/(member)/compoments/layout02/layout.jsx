'use client';

import { RouteGuard, Loading, AccessDenied } from '@/shared/component';
import styles from '@/shared/ui/Wrapper/wrapper.module.scss';
import Top from '@/shared/ui/Title/TopTit';

const title = '기업 맞춤형 IT 솔루션, 펜타웨어';

export default function TestLayout02({ children }) {
  return (
    <div className={`${styles.container} mainLayout`}>
      <Top title={title} />
      {children}
    </div>
  );
}
