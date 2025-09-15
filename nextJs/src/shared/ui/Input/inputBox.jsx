// 인풋 레이블 + 텍스트인풋 합본
import InputTit from './InputTit';
import InputTxt from './InputTxt';
import styles from './inputTxt.module.scss';

export default function InputBox({ txtInfo }) {
  const { txtTit, essential } = txtInfo;
  return (
    <div className={styles.inputTxtCustom}>
      <InputTit inputTit={txtTit} essential={essential} />
      <InputTxt txtInfo={txtInfo} />
    </div>
  );
}
