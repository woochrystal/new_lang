'use client';
import { useRef, useState } from 'react';
import styles from '@/shared/ui/uploadBox/uploadBox.module.scss';
import Tag from '../Tag/Tag';

export default function FullUpBox({ ...rest }) {
  //시간 가져오기
  const today = new Date();
  const year = today.getFullYear();
  const month = ('0' + (today.getMonth() + 1)).slice(-2);
  const day = ('0' + today.getDate()).slice(-2);

  const hour = today.getHours();
  const minutes = today.getMinutes();
  const seconds = today.getSeconds();
  const hourStr = ('0' + hour).slice(-2);
  const minStr = ('0' + minutes).slice(-2);
  const secStr = ('0' + seconds).slice(-2);

  // 최종 출력
  const date = year + '-' + month + '-' + day;
  const time = `${hourStr}:${minStr}:${secStr}`;

  return (
    <div className={`${styles.uploadBox} ${styles.statusBox}`} {...rest}>
      <div className={`${styles.plusWrap} ${styles.hasDate}`}>
        <Tag variant="text" status="pending" />
        <div className={styles.upBoxDates}>
          <span>{date}</span>
          <span>{time}</span>
        </div>
      </div>
      <div className={styles.uploadBoxName}>
        <span className={styles.checkName}>김감동</span>
      </div>
    </div>
  );
}
