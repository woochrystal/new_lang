'use client';

import { Input, Select, Label } from '@/shared/component';

//공통디자인 scss
import styles from '@/shared/component/layout/layout.module.scss';

/**
 * 휴가일수 검색 및 필터 컴포넌트
 * @param {Object} props
 * @param {number} props.year - 선택된 기준년도
 * @param {string} props.empName - 직원명 검색어
 * @param {Function} props.onYearChange - 기준년도 변경 핸들러
 * @param {Function} props.onEmpNameChange - 직원명 변경 핸들러
 * @param {Function} props.onSearch - 검색 실행 핸들러 (Enter 키)
 * @param {Array} props.yearOptions - 년도 옵션 목록
 */
const VacCntSearch = function (props) {
  const { year, empName, onYearChange, onEmpNameChange, onSearch, yearOptions = [] } = props;

  const handleClear = function () {
    onEmpNameChange({ target: { value: '' } });
  };

  return (
    <div className={`${styles.hasItem02}`}>
      <div>
        <Label>기준년도</Label>
        <Select value={year} onChange={onYearChange} options={yearOptions} className="flex-1" />
      </div>

      <div>
        <Label>직원명</Label>
        <Input
          variant="search"
          value={empName}
          onChange={onEmpNameChange}
          onSearch={onSearch}
          onClear={handleClear}
          placeholder="직원명을 입력하세요"
          className="flex-1"
        />
      </div>
    </div>
  );
};

export default VacCntSearch;
