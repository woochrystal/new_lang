'use client';
import { useEffect, useState } from 'react';
import styles from './search.module.scss';

export default function Search() {
  const [txtData, setTxtData] = useState('');

  useEffect(() => {}, [txtData]); //search에 값 들어올때마다(삭제버튼을 위함)

  return (
    <>
      <div className={styles.searchCustom}>
        <div className={styles.inputSearch}>
          <input
            type="search"
            id={'searchInput1'}
            placeholder={'검색인풋'}
            value={txtData}
            onChange={(e) => setTxtData(e.target.value)}
            disabled={false}
          />
          <i className={`${txtData ? styles.hasDelete : ''}`}>
            <img src="/delete.png" alt="검색어 작성 삭제" />
          </i>
          <button>
            <img src="/search.png" alt="돋보기 아이콘" />
          </button>
        </div>
      </div>
      <div className={styles.searchCustom}>
        <div className={styles.inputSearch}>
          <input type="search" id={'searchInput'} placeholder={'검색비활'} disabled={true} />
          <i>
            <img src="/delete.png" alt="검색어 작성 삭제" />
          </i>
          <button>
            <img src="/search.png" alt="돋보기 아이콘" />
          </button>
        </div>
      </div>
    </>
  );
}
