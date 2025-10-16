import styles from '@/shared/ui/Button/buttonBasic.module.scss';
export default function BasicBtn() {
  // 흰색버튼
  return (
    <>
      <button className={`${styles.btnBasic} ${styles.primeBtn}`}>{'보라색버튼'}</button>
      <button className={`${styles.btnBasic} ${styles.secondBtn}`}>{'연보라버튼'}</button>
      <button className={`${styles.btnBasic}`}>{'기본흰색버튼'}</button>
    </>
  );
}
