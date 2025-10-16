'use client';

import { useState } from 'react';

import Button from '@/shared/ui/Button/Button';
import { LoggerFactory } from '@/shared/lib/logger';

import styles from './BoardSearch.module.scss';

const logger = LoggerFactory.getLogger('BoardSearch');

// ============================================================================
// Event Handlers
// ============================================================================

const searchHandler = (searchInput, onSearch) => () => {
  const keyword = searchInput.trim();
  logger.info('게시판 검색 실행: {}', keyword);
  onSearch(keyword);
};

const clearHandler = (setSearchInput, onClear) => () => {
  setSearchInput('');
  logger.info('게시판 검색 초기화');
  onClear();
};

const keyPressHandler = (handleSearch) => (e) => {
  if (e.key === 'Enter') {
    handleSearch();
  }
};

// ============================================================================
// Component
// ============================================================================

/**
 * 게시판 검색 컴포넌트
 * @param {Function} props.onSearch - 검색 실행 콜백
 * @param {Function} props.onClear - 검색 초기화 콜백
 * @param {string} props.searchKeyword - 현재 검색어
 * @param {boolean} props.loading - 로딩 상태
 */
export function BoardSearch({ onSearch, onClear, searchKeyword = '', loading = false }) {
  const [searchInput, setSearchInput] = useState(searchKeyword);

  const handleSearch = searchHandler(searchInput, onSearch);
  const handleClear = clearHandler(setSearchInput, onClear);
  const handleKeyPress = keyPressHandler(handleSearch);

  return (
    <div className={styles.searchContainer}>
      <div className={styles.searchWrapper}>
        <input
          type="search"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="제목으로 검색..."
          disabled={loading}
          className={styles.searchInput}
        />

        <div className={styles.buttonGroup}>
          <Button
            variant="primary"
            label="검색"
            className={styles.buttonMedium}
            onClick={handleSearch}
            disabled={loading}
          />
          <Button
            variant="secondary"
            label="초기화"
            className={styles.buttonMedium}
            onClick={handleClear}
            disabled={loading}
          />
        </div>
      </div>
    </div>
  );
}

export default BoardSearch;
