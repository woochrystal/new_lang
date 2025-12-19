'use client';

import { RouteGuard, Loading, AccessDenied } from '@/shared/component';
import Top from '@/shared/ui/Title/TopTit';
import styles from '@/shared/ui/Wrapper/wrapper.module.scss';

const title = '기업 맞춤형 IT 솔루션, 펜타웨어';

export default function TestLayout03({ children }) {
  return (
    <div className={styles.container}>
      <Top title={title} />
      {children}
    </div>
  );
}
