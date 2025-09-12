import PwShowBtn from '@/shared/ui/Button/PwShowBtn';
import styles from './inputTxt.module.scss';
// 텍스트 인풋
export default function InputTxt({ txtInfo }) {
  const { inputType, txtId, defaultTxt } = txtInfo;

  return (
    <div className={styles.inputTxt}>
      {/* 기본 텍스트 인풋 */}
      <input type={inputType} id={txtId} placeholder={defaultTxt} />
      {/* 비번일때 눈모양 */}
      {inputType == 'password' ? <PwShowBtn /> : null}
    </div>
  );
}
