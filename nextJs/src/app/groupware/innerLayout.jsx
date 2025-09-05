import styles from '@/shared/ui/ui/innerLayout.module.scss';
import VacationExample from './(member)/example/vacationExample';
import Top from '../../components/title/topTit';

export default function Inner() {
  return (
    <div className={styles.innerLayout}>
      <Top />
      <VacationExample />
    </div>
  );
}
