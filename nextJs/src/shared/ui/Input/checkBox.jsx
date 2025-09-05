'use client';
import { useEffect, useState } from 'react';
import './inputBasic.scss';

export default function CheckBox({ checkInfo }) {
  const { checkName, checkId, checkTxt, fff } = checkInfo;
  const [check, setCheck] = useState(false);
  useEffect(() => {}, [check]);

  return (
    <div className={`checkWrap ${check ? 'checked' : ''} ${fff ? 'hasFFF' : ''}`}>
      <input
        type="checkbox"
        name={checkName}
        id={checkId}
        checked={check}
        onChange={(e) => setCheck(e.target.checked)}
      />
      <label htmlFor={checkId}>
        <i>
          <img
            src={
              fff ? '/check_fff.svg' : '/check_purple.svg' //기본
            }
            alt="체크이미지"
          />
        </i>
        <span>{checkTxt}</span>
      </label>
    </div>
  );
}
