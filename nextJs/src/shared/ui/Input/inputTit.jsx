import styles from './inputTit.module.scss';

export default function InputTit() {
  // 필수일때는 앞에 별 표시 (essential값 true 일 시 span에 hasStar 클래스)
  // 인풋 disabled 일 경우 별도 디자인으로 라벨도 disabled 표시
  return (
    <>
      <label className={styles.inputTit}>
        <span>{'인풋라벨명'}</span>
        {/* <span className={styles.disabled}>{'인풋disabled라벨'}</span> */}
        {/* <span className={styles.hasStar}>{'필수인풋라벨'}</span> */}
        {/* <span className={`${styles.hasStar} ${styles.disabled}`}>{'필수인풋disabled라벨'}</span> */}
      </label>
    </>
  );
}
