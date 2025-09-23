import styles from '@/shared/ui/Button/buttonBasic.module.scss';
export default function PrimaryBtn({ btnName, onClick }) {
  // 보라색
  return (
    <button className={`${styles.btnBasic} ${styles.primeBtn}`} onClick={onClick}>
      {btnName}
    </button>
  );
}
