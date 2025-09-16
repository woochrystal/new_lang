'use client';
import RadioCircle from '@/shared/ui/Input/RadioCircle';
import RadioButton from '@/shared/ui/Input/RadioButton';
import { useEffect, useState } from 'react';
import styles from './radioCustom.module.scss';

export default function RadioGroup({ radioGroupInfo, type = 'circle' }) {
  const { defaultValue, name, radioOp, onChange } = radioGroupInfo;

  //기본으로 첫번째 라디오버튼 선택
  let valueSetting = '';

  if (defaultValue != undefined && defaultValue != null) {
    valueSetting = defaultValue;
  } else if (radioOp && radioOp.length > 0) {
    valueSetting = radioOp[0].value;
  }

  //기본값 -> 클릭값 가져오기
  const [radioClick, setRadioClick] = useState(valueSetting);

  useEffect(() => {
    if (onChange) {
      onChange(radioClick);
    }
  }, [radioClick, onChange]); //클릭할때 value 변경

  const radioValChange = (value) => {
    setRadioClick(value);
    if (onChange) {
      onChange(value);
    }
  };

  const RadioComp = type === 'button' ? RadioButton : RadioCircle;

  return (
    <div className={styles.radioBox}>
      {radioOp.map((option, i) => {
        return (
          <RadioComp
            key={i}
            name={name}
            radioTit={option.radioTit}
            value={option.value}
            checked={radioClick == option.value}
            onChange={radioValChange}
          />
        );
      })}
    </div>
  );
}
