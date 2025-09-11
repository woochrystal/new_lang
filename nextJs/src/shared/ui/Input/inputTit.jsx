import styles from './inputTit.module.scss';

export default function InputTit({ inputTit, essential }) {
  return (
    <div className={styles.inputTit}>
      {/* 필수일때는 앞에 별 표시 (essential값 true 일 시 span에 hasStar 클래스)*/}
      <span className={essential ? `${styles.hasStar}` : ``}>{inputTit}</span>
    </div>
  );
}
