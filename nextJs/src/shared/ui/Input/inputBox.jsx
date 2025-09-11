import InputTit from './inputTit';
import InputTxt from './inputTxt';
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
