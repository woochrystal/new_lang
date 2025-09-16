import styles from '@/shared/ui/Button/buttonBasic.module.scss';
export default function PrimaryBtn({ btnName }) {
  // 보라색
  return <button className={`${styles.btnBasic} ${styles.primeBtn}`}>{btnName}</button>;
}
