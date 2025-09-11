import styles from './inputTxt.module.scss';

// 텍스트 인풋
export default function InputTxt({ txtInfo }) {
  const { inputType, txtId, defaultTxt } = txtInfo;
  return (
    <div className={styles.inputTxt}>
      <input type={inputType} id={txtId} placeholder={defaultTxt} />
    </div>
  );
}
