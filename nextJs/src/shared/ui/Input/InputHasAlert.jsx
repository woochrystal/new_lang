import InputTit from './InputTit';
import InputTxt from './InputTxt';
import InputAlertTxt from '@/shared/ui/Alert/InputAlertTxt';
import styles from './inputTxt.module.scss';

export default function InputHasAlert({ txtInfo }) {
  const { txtTit, essential, txtId } = txtInfo;
  return (
    <div className={styles.inputTxtCustom}>
      <InputTit inputTit={txtTit} essential={essential} />
      <InputTxt txtInfo={txtInfo} />
      <InputAlertTxt targetId={txtId} />
    </div>
  );
}
