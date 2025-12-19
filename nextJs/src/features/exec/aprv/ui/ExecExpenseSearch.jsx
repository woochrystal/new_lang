import { Select, Label, Input } from '@/shared/component';
import DatepickerGroup from '@/shared/ui/Input/DatepickerGroup';
import RadioButton from '@/features/task/vac_expense/ui/RadioButton';

//공통디자인 scss
import layoutStyles from '@/shared/component/layout/layout.module.scss';
import inputStyles from '@/shared/component/input/input.module.scss';

/**
 * 임원 비용 현황 검색 컴포넌트
 * 날짜범위, 결재상태, 기안자 검색 필터를 제공합니다.
 */
const ExecExpenseSearch = (props) => {
  const {
    startDate,
    endDate,
    periodType,
    onDateChange,
    onPeriodTypeChange,
    approvalStatusOptions = [],
    approvalStatus = 'all',
    onApprovalStatusChange,
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

      {/* 기안자 검색 */}
      <Input
        label="기안자"
        type="text"
        value={value}
        onChange={onChange}
        onKeyPress={handleKeyPress}
        placeholder="기안자명을 입력하세요"
        disabled={disabled}
      />
    </>
  );
};

export default ExecExpenseSearch;
