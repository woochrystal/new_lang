import styles from '@/shared/ui/Button/buttonBasic.module.scss';

export default function PopupBtn() {
  return (
    <div>
      <button className={`${styles.btnBasic} ${styles.primeBtn}`}>{btnName}</button>
      <button className={`${styles.btnBasic} ${styles.secondBtn}`}>{btnName}</button>
    </div>
  );
}
