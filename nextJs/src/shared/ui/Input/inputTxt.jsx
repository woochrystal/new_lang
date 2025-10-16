import styles from './inputTxt.module.scss';
import btnstyles from '@/shared/ui/Button/buttonBasic.module.scss';
// 텍스트 인풋
export default function InputTxt() {
  return (
    <>
      {/* 기본 텍스트 인풋 */}
      <div className={styles.inputTxt}>
        <input type={'text'} placeholder={'기본 텍스트 인풋'} />
      </div>

      <div className={styles.inputTxt}>
        <input type={'text'} placeholder={'비활성화'} disabled={true} />
      </div>

      <div className={`${styles.inputPw} ${styles.inputTxt}`}>
        <input type={'password'} placeholder={'비밀번호 입력'} />
        <button className={`${btnstyles.pwShowBtn}`}>
          <img src="/pwShowBtn_off.svg" alt="눈 꺼져있는 아이콘" />
          <img src="/pwShowBtn_on.svg" alt="눈 켜져있는 아이콘" />
        </button>
      </div>
    </>
  );
}
