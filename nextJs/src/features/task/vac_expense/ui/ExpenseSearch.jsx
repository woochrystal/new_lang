import { Select, Label } from '@/shared/component';
import DatepickerGroup from '@/shared/ui/Input/DatepickerGroup';
import RadioButton from './RadioButton';

//공통디자인 scss
import inputStyles from '@/shared/component/input/input.module.scss';
import layoutStyles from '@/shared/component/layout/layout.module.scss';

/**
 * 비용 검색 바 컴포넌트
 * 조회 기간, 결재상태, 결제수단 필터를 제공합니다.
 */
const ExpenseSearch = (props) => {
  const {
    startDate,
    endDate,
    periodType,
    onDateChange,
    onPeriodTypeChange,
    approvalStatusOptions = [],
    approvalStatus = 'all',
    onApprovalStatusChange,
    expenseTypeOptions = [],
    expenseType = 'all',
    onExpenseTypeChange,
    disabled = false
  } = props;

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
      <div>
        <Select
          label="결재상태"
          options={approvalStatusOptions}
          value={approvalStatus}
          onChange={onApprovalStatusChange}
          placeholder="선택하세요"
          disabled={disabled}
        />
      </div>

      {/* 결제수단 */}
      <div>
        <Select
          label="결제수단"
          options={expenseTypeOptions}
          value={expenseType}
          onChange={onExpenseTypeChange}
          placeholder="선택하세요"
          disabled={disabled}
        />
      </div>
    </>
  );
};

export default ExpenseSearch;
