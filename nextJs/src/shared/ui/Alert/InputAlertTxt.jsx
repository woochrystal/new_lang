'use client';

import { useState, useEffect } from 'react';
import styles from './inputAlertTxt.module.scss';

export default function InputAlertTxt({ targetId }) {
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const input = document.getElementById(targetId);
    if (!input) return;

    const handler = (e) => {
      if (e.getModifierState && e.getModifierState('CapsLock')) {
        setMessage(<p className={styles.alertTxtRed}>Caps Lock이 켜져 있습니다</p>); //CapsLock on/off
      } else {
        setMessage(null); //문구없음 기본
      }
    };

    input.addEventListener('keydown', handler);
    input.addEventListener('keyup', handler); //키보드 누르고 뗄 때

    return () => {
      input.removeEventListener('keydown', handler);
      input.removeEventListener('keyup', handler);
    }; //키보드이벤트 clean
  }, [targetId]);

  if (!message) return null; //조건 해당 안되면 실행x

  return <div className={styles.inputAlertTxt}>{message}</div>;
}
