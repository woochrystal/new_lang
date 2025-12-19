'use client';
import { useState, useEffect } from 'react';
import styles from '@/shared/ui/Input/radioCustom.module.scss';

export default function RadioCircle() {
  //더미데이터
  const name = 'radio input01';

  // 값 확인용-없어도됨
  const onChange = (val) => {
    setChoice(val);
  };

  // 기본 선택값 세팅
  let valueSetting = '1값';

  //기본값 -> 클릭값 가져오기
  const [radioClick, setRadioClick] = useState(valueSetting);

  // 라디오 선택 시 값 변경
  const radioValChange = (value) => {
    setRadioClick(value);
    // onChange(value);// 값 확인용-없어도됨
  };

  return (
    <div className={styles.radioBox}>
      <label className={styles.radioCustom}>
        <input
          type="radio"
          name={name}
          value={'1값'}
          checked={radioClick == '1값'}
          onChange={() => radioValChange('1값')}
        />
        <span className={styles.radioIndicator}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" className={styles.circle}>
            <rect x="1.5" y="1.5" width="17" height="17" rx="8.5" className={styles.circleOuter} />
            <rect x="5" y="5" width="10" height="10" rx="5" className={styles.circleOn} />
          </svg>
          <span className={styles.radioLabel}>{'라디오1'}</span>
        </span>
      </label>

      <label className={styles.radioCustom}>
        <input
          type="radio"
          name={name}
          value={'2값'}
          checked={radioClick == '2값'}
          onChange={() => radioValChange('2값')}
        />
        <span className={styles.radioIndicator}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" className={styles.circle}>
            <rect x="1.5" y="1.5" width="17" height="17" rx="8.5" className={styles.circleOuter} />
            <rect x="5" y="5" width="10" height="10" rx="5" className={styles.circleOn} />
          </svg>
          <span className={styles.radioLabel}>{'라디오2'}</span>
        </span>
      </label>

      <label className={styles.radioCustom}>
        <input
          type="radio"
          name={name}
          value={'3값'}
          checked={radioClick == '3값'}
          onChange={() => radioValChange('3값')}
        />
        <span className={styles.radioIndicator}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" className={styles.circle}>
            <rect x="1.5" y="1.5" width="17" height="17" rx="8.5" className={styles.circleOuter} />
            <rect x="5" y="5" width="10" height="10" rx="5" className={styles.circleOn} />
          </svg>
          <span className={styles.radioLabel}>{'라디오3'}</span>
        </span>
      </label>
    </div>
  );
}
