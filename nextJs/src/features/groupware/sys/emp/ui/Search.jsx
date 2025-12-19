'use client';

import { Input, Select, Label } from '@/shared/component';
import { EMP_CONSTANTS } from '../script/constants';

//공통디자인 scss
import styles from '@/shared/component/layout/layout.module.scss';

/**
 * 직원 검색 컴포넌트
 * @param {Object} props
 * @param {string} props.empType - 계약구분 (정직원/계약직/협력사)
 * @param {string} props.searchKeyword - 직원명 검색어
 * @param {Function} props.onEmpTypeChange - 계약구분 변경 핸들러
 * @param {Function} props.onSearchChange - 검색어 변경 핸들러
 * @param {Function} props.onSearch - 검색 실행 핸들러
 */
const EmpSearch = function (props) {
  const { empType, searchKeyword, onEmpTypeChange, onSearchChange, onSearch } = props;

  const handleClear = function () {
    onSearchChange({ target: { value: '' } });
  };

  return (
    <div className={`${styles.hasItem02}`}>
      <div>
        <Label>계약구분</Label>
        <Select
          value={empType}
          onChange={onEmpTypeChange}
          options={EMP_CONSTANTS.EMP_TYPE_OPTIONS}
          className="flex-1"
        />
      </div>

      <div>
        <Label>직원명</Label>
        <Input
          variant="search"
          value={searchKeyword}
          onChange={onSearchChange}
          onSearch={onSearch}
          onClear={handleClear}
          placeholder="직원명을 입력하세요"
          className="flex-1"
        />
      </div>
    </div>
  );
};

export default EmpSearch;
