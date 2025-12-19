/**
 * @fileoverview 프로젝트현황 검색 컴포넌트
 * @description 프로젝트 기간, 검색 타입, 검색어 필터링
 */

'use client';

import { Input, Select, Label } from '@/shared/component';
import DatepickerGroup from '@/shared/ui/Input/DatepickerGroup';
import RadioButton from './RadioButton';

import { WORK_CONSTANTS } from '../script/constants';

// 공통 디자인 scss
import styles from '@/shared/component/layout/layout.module.scss';

/**
 * 프로젝트현황 검색 컴포넌트
 * @param {Object} props
 * @param {string|null} props.startDate - 시작일 (YYYY-MM-DD)
 * @param {string|null} props.endDate - 종료일 (YYYY-MM-DD)
 * @param {string} props.periodType - 기간 타입 (1M/3M/6M/1Y)
 * @param {string} props.searchType - 검색 타입 (prjNm/prjClient/status/empNm)
 * @param {string} props.searchKeyword - 검색 키워드
 * @param {string} props.status - 프로젝트 상태
 * @param {Function} props.onDateChange - 날짜 변경 핸들러
 * @param {Function} props.onPeriodTypeChange - 기간 타입 변경 핸들러
 * @param {Function} props.onSearchTypeChange - 검색 타입 변경 핸들러
 * @param {Function} props.onSearchKeywordChange - 검색어 변경 핸들러
 * @param {Function} props.onStatusChange - 상태 변경 핸들러
 * @param {Function} props.onSearch - 검색 핸들러
 * @param {Function} props.onClear - 초기화 핸들러
 * @param {boolean} [props.disabled=false] - 비활성화 여부
 */
const Search = function ({
  startDate,
  endDate,
  periodType,
  searchType,
  searchKeyword,
  status,
  onDateChange,
  onPeriodTypeChange,
  onSearchTypeChange,
  onSearchKeywordChange,
  onStatusChange,
  onSearch,
  onClear,
  disabled = false
}) {
  // 검색어 초기화 핸들러
  const handleClearKeyword = function () {
    onSearchKeywordChange({ target: { value: '' } });
  };

  return (
    <>
      {/* 프로젝트 기간 */}
      <div>
        <Label>조회기간</Label>
        <DatepickerGroup startDate={startDate} endDate={endDate} onChange={onDateChange} disabled={disabled} />
        <div className={styles.dateRangeBtn}>
          <RadioButton value={periodType} onChange={onPeriodTypeChange} disabled={disabled} />
        </div>
      </div>

      {/* 검색 타입 */}
      <div>
        <Label>선택</Label>
        <Select
          id="searchType"
          value={searchType}
          onChange={onSearchTypeChange}
          disabled={disabled}
          options={WORK_CONSTANTS.SEARCH_TYPE_OPTIONS}
        />
      </div>

      {/* 진행상태 셀렉트박스 또는 검색어 - 1칸 (항상 div 유지) */}
      <div>
        {searchType === 'status' ? (
          <>
            <Label>진행상태</Label>
            <Select
              id="status"
              value={status}
              onChange={onStatusChange}
              disabled={disabled}
              options={WORK_CONSTANTS.STATUS_OPTIONS}
            />
          </>
        ) : (
          <>
            <Label>검색어</Label>
            <Input
              variant="search"
              id="searchKeyword"
              value={searchKeyword}
              onChange={onSearchKeywordChange}
              onSearch={onSearch}
              onClear={handleClearKeyword}
              disabled={disabled}
              placeholder="검색어를 입력해주세요"
            />
          </>
        )}
      </div>
    </>
  );
};

export default Search;
