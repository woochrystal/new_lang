import styles from '@/shared/ui/Button/buttonBasic.module.scss';
export default function SecondBtn() {
  // 연보라
  return <button className={`${styles.btnBasic} ${styles.secondBtn}`}>{'보조기능버튼'}</button>;
}
