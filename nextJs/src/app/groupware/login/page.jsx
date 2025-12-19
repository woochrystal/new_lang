'use client';

import { BrandingSection, LoginForm } from '@/features/groupware/login';
import styles from './page.module.scss';
import Footer from '@/shared/ui/Footer/Footer';
import { useAuthStore } from '@/shared/store';
import { redirect } from 'next/navigation';

function LoginPage() {
  const returnUrl = useAuthStore((state) => state.returnUrl);

  return (
    <div className={styles.loginContainer}>
      <main className={styles.mainContent}>
        <div className={styles.cardsContainer}>
          <BrandingSection />
          <LoginForm returnUrl={returnUrl} />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function newLoginPage() {
  const defaultTenant = process.env.NEXT_PUBLIC_DEFAULT_TENANT_ID || 'pentas';
  redirect(`/${defaultTenant}/login`);
}
