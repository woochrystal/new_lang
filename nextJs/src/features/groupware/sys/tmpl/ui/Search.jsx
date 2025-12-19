'use client';

import { Input, Select, Label } from '@/shared/component';
import { TMPL_CONSTANTS } from '../script/constants';

//공통디자인 scss
import styles from '@/shared/component/layout/layout.module.scss';

/**
 * 템플릿 검색 컴포넌트
 * @param {Object} props
 * @param {Object} props.value - 검색 조건 값
 * @param {Function} props.onChange - 검색 조건 변경 핸들러
 * @param {Function} props.onSearch - 검색 실행 핸들러
 */
const TmplSearch = function (props) {
  const { value, onChange, onSearch } = props;

  const handleChange = function (field) {
    return function (e) {
      onChange({ [field]: e.target.value });
    };
  };

  const handleSelectChange = function (selectValue) {
    onChange({ searchType: selectValue, searchKeyword: '' });
  };

  const handleSearchKeywordChange = function (selectValue) {
    onChange({ searchKeyword: selectValue });
  };

  const handleClear = function () {
    onChange({ searchKeyword: '' });
  };

  const isUseYnSearch = value.searchType === 'useYn';

  return (
    <div className={`${styles.hasItem02}`}>
      <div>
        <Label>조회 조건</Label>
        <Select
          value={value.searchType}
          onChange={handleSelectChange}
          options={TMPL_CONSTANTS.SEARCH_TYPES}
          className="flex-1"
        />
      </div>

      <div>
        <Label>검색어</Label>
        {isUseYnSearch ? (
          <Select
            value={value.searchKeyword || ''}
            onChange={handleSearchKeywordChange}
            options={TMPL_CONSTANTS.USE_YN_SEARCH_OPTIONS}
            className="flex-1"
          />
        ) : (
          <Input
            variant="search"
            value={value.searchKeyword}
            onChange={handleChange('searchKeyword')}
            onSearch={onSearch}
            onClear={handleClear}
            placeholder="검색어를 입력하세요"
            className="flex-1"
          />
        )}
      </div>
    </div>
  );
};

export default TmplSearch;
