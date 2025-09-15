import styles from '@/shared/ui/Button/buttonBasic.module.scss';
export default function SecondBtn() {
  // 연보라
  const btnName = '보조기능버튼';
  return <button className={`${styles.btnBasic} ${styles.secondBtn}`}>{btnName}</button>;
}
