import InputTit from "./inputTit";
import styles from "./inputTxt.module.scss";

// 텍스트 인풋
export default function InputTxt({ txtInfo }) {
  const{ txtTit, txtId, defaultTxt } = txtInfo;
  return (
    <div className={styles.inputTxtCustom}>
      <InputTit inputTit={txtTit} />
      <div className={styles.inputTxt}>
        <input type="text" id={txtId} placeholder={defaultTxt} />
      </div>
    </div>
  );
}
