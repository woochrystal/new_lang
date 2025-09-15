import styles from '@/shared/ui/Button/buttonBasic.module.scss';
export default function PrimaryBtn() {
  // 보라색
  const btnName = '메인기능버튼';
  return <button className={`${styles.btnBasic} ${styles.primeBtn}`}>{btnName}</button>;
}
