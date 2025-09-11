import Top from '@/shared/ui/Title/topTit';
import styles from './layout.module.scss';

const title = '기업 맞춤형 IT 솔루션, 펜타웨어';

export default function Inner({ children }) {
  return (
    <div className={styles.innerLayout}>
      <Top title={title} />
      {children}
    </div>
  );
}
