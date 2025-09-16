import styles from '@/shared/ui/Button/buttonBasic.module.scss';
export default function SecondBtn({ btnName }) {
  // 연보라
  return <button className={`${styles.btnBasic} ${styles.secondBtn}`}>{btnName}</button>;
}
