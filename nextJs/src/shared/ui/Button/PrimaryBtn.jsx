import styles from '@/shared/ui/Button/buttonBasic.module.scss';
export default function PrimaryBtn() {
  // 보라색
  return <button className={`${styles.btnBasic} ${styles.primeBtn}`}>{'메인기능버튼'}</button>;
}
