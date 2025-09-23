'use client';
import { useRef, useState } from 'react';
import styles from '@/shared/ui/uploadBox/uploadBox.module.scss';
// import SearchBox from '@/shared/ui/Input/SearchBox';
import SearchInput from '../Input/SearchInput';

export default function StatusBox({ searchInfo }) {
  return (
    <div className={`${styles.uploadBox} ${styles.statusBox}`}>
      <div>
        <div className={styles.plusWrap}>
          <img src="/uploadPlus.svg" alt="추가" />
        </div>
      </div>
      <div className={styles.uploadBoxName}>
        <SearchInput searchInfo={searchInfo} />
      </div>
    </div>
  );
}
