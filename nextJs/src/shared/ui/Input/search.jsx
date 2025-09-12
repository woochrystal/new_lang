'use client';
import { useEffect, useState } from 'react';
import InputTit from './InputTit';
import styles from './search.module.scss';

export default function Search({ searchInfo }) {
  const { searchTit, searchId, defaultTxt, disabled } = searchInfo;
  const [txtData, setTxtData] = useState('');

  useEffect(() => {}, [txtData]); //search에 값 들어올때마다

  return (
    <div className={styles.searchCustom}>
      <InputTit inputTit={searchTit} />
      <div className={styles.inputSearch}>
        <input
          type="search"
          id={searchId}
          placeholder={defaultTxt}
          value={txtData}
          onChange={(e) => setTxtData(e.target.value)}
          disabled={disabled}
        />
        <i className={`${txtData ? styles.hasDelete : ''}`}>
          <img src="/delete.png" alt="검색어 작성 삭제" />
        </i>
        <button>
          <img src="/search.png" alt="검색하기" />
        </button>
      </div>
    </div>
  );
}
