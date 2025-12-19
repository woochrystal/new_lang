'use client';
import { useState, useEffect } from 'react';
import styles from '@/shared/ui/Input/radioCustom.module.scss';

export default function RadioCircle() {
  //더미데이터
  const name = 'radio input02';

  // 기본 선택값 세팅
  let valueSetting = '1값';

  //기본값 -> 클릭값 가져오기
  const [radioClick, setRadioClick] = useState(valueSetting);

  // 값 확인용-없어도됨
  // const [choice, setChoice] = useState('');
  // const onChange = (val) => {
  //   setChoice(val);
  // };
  // useEffect(() => {
  //   onChange(radioClick);
  // }, [radioClick]);

  // 라디오 선택 시 값 변경
  const radioValChange = (value) => {
    setRadioClick(value);
    // onChange(value);// 값 확인용-없어도됨
  };

  return (
    <div className={styles.radioBox}>
      <label className={`${styles.radioCustom} ${styles.radioButton}`}>
        <input
          type="radio"
          name={name}
          value={'1값'}
          checked={radioClick == '1값'}
          onChange={() => radioValChange('1값')}
        />
        <span className={styles.radioIndicator}>
          <span>{'radio1'}</span>
        </span>
      </label>

      <label className={`${styles.radioCustom} ${styles.radioButton}`}>
        <input
          type="radio"
          name={name}
          value={'2값'}
          checked={radioClick == '2값'}
          onChange={() => radioValChange('2값')}
        />
        <span className={styles.radioIndicator}>
          <span>{'radio2'}</span>
        </span>
      </label>

      <label className={`${styles.radioCustom} ${styles.radioButton}`}>
        <input
          type="radio"
          name={name}
          value={'3값'}
          checked={radioClick == '3값'}
          onChange={() => radioValChange('3값')}
        />
        <span className={styles.radioIndicator}>
          <span>{'radio3'}</span>
        </span>
      </label>
      {/* <p>값 확인용 - 없어도됨: {choice}</p> */}
    </div>
  );
}
