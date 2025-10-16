import { BrandingSection, LoginForm } from '@/features/groupware/login';
import styles from './page.module.scss';
import Footer from '@/shared/ui/Footer/Footer';

export default function LoginPage() {
  return (
    <div className={styles.loginContainer}>
      <main className={styles.mainContent}>
        <div className={styles.cardsContainer}>
          <BrandingSection />
          <LoginForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}
