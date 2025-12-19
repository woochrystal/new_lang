import { Select, Label, Input } from '@/shared/component';
import DatepickerGroup from '@/shared/ui/Input/DatepickerGroup';
import RadioButton from '@/features/task/vac_expense/ui/RadioButton';

//공통디자인 scss
import layoutStyles from '@/shared/component/layout/layout.module.scss';
import inputStyles from '@/shared/component/input/input.module.scss';

/**
 * 임원 일반 현황 검색 컴포넌트
 * 날짜범위, 결재상태, 검색구분, 검색어 필터를 제공합니다.
 */
const ExecGeneralSearch = (props) => {
  const {
    startDate,
    endDate,
    periodType,
    onDateChange,
    onPeriodTypeChange,
    approvalStatusOptions = [],
    approvalStatus = 'all',
    onApprovalStatusChange,
    searchTypeOptions = [],
    searchType = 'draftUsrNm',
    onSearchTypeChange,
    value = '',
    onChange,
    onSearch,
    onClear,
    disabled = false
  } = props;

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch();
    }
  };

  // 검색 타입에 따른 placeholder
  const getPlaceholder = () => {
    switch (searchType) {
      case 'draftUsrNm':
        return '기안자명을 입력하세요';
      case 'title':
        return '결재 제목을 입력하세요';
      default:
        return '검색어를 입력하세요';
    }
  };

  return (
    <>
      {/* 조회 기간 */}
      <div className={inputStyles.wrapper}>
        <Label>조회기간</Label>
        <DatepickerGroup startDate={startDate} endDate={endDate} onChange={onDateChange} disabled={disabled} />
        <div className={layoutStyles.dateRangeBtn}>
          <RadioButton value={periodType} onChange={onPeriodTypeChange} disabled={disabled} />
        </div>
      </div>

      {/* 결재상태 */}
      <Select
        label="결재상태"
        options={approvalStatusOptions}
        value={approvalStatus}
        onChange={onApprovalStatusChange}
        disabled={disabled}
      />

      {/* 검색구분 */}
      <Select
        label="검색구분"
        options={searchTypeOptions}
        value={searchType}
        onChange={onSearchTypeChange}
        disabled={disabled}
      />

      {/* 검색어 입력 */}
      <Input
        label="검색어"
        type="text"
        value={value}
        onChange={onChange}
        onKeyPress={handleKeyPress}
        placeholder={getPlaceholder()}
        disabled={disabled}
      />
    </>
  );
};

export default ExecGeneralSearch;
