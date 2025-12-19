import { Select, Label } from '@/shared/component';
import DatepickerGroup from '@/shared/ui/Input/DatepickerGroup';
import RadioButton from '@/features/task/vac_expense/ui/RadioButton';

//공통디자인 scss
import styles from '@/shared/component/layout/layout.module.scss';
import inputStyles from '@/shared/component/input/input.module.scss';

/**
 * 결재 문서 검색 바 컴포넌트
 * 조회 기간, 결재유형, 결재상태 필터를 제공합니다.
 *
 * @param {Object} props
 * @param {string} props.startDate - 조회 시작일 (YYYY-MM-DD)
 * @param {string} props.endDate - 조회 종료일 (YYYY-MM-DD)
 * @param {string} props.periodType - 기간 타입 (1M, 3M, 6M, 1Y)
 * @param {Function} props.onDateChange - 날짜 변경 핸들러 (start, end) => void
 * @param {Function} props.onPeriodTypeChange - 기간 타입 변경 핸들러
 * @param {Array<{value: string, label: string}>} props.approvalTypeOptions - 결재유형 옵션 배열
 * @param {string} props.approvalType - 결재유형 선택값
 * @param {Function} props.onApprovalTypeChange - 결재유형 변경 핸들러
 * @param {Array<{value: string, label: string}>} props.approvalStatusOptions - 결재상태 옵션 배열
 * @param {string} props.approvalStatus - 결재상태 선택값
 * @param {Function} props.onApprovalStatusChange - 결재상태 변경 핸들러
 * @param {boolean} [props.disabled=false] - 비활성화 상태
 */
const ApprovalSearch = (props) => {
  const {
    startDate,
    endDate,
    periodType,
    onDateChange,
    onPeriodTypeChange,
    approvalTypeOptions = [],
    approvalType = 'all',
    onApprovalTypeChange,
    approvalStatusOptions = [],
    approvalStatus = 'all',
    onApprovalStatusChange,
    disabled = false
  } = props;

  return (
    <div className={styles.hasItem03}>
      {/* 조회 기간 */}
      <div className={inputStyles.wrapper}>
        <Label>조회 기간</Label>
        <DatepickerGroup startDate={startDate} endDate={endDate} onChange={onDateChange} disabled={disabled} />
        <div className={styles.dateRangeBtn}>
          <RadioButton value={periodType} onChange={onPeriodTypeChange} disabled={disabled} />
        </div>
      </div>

      {/* 결재유형 Select */}
      <Select
        label="결재유형"
        options={approvalTypeOptions}
        value={approvalType}
        onChange={onApprovalTypeChange}
        placeholder="선택하세요"
        disabled={disabled}
      />

      {/* 결재상태 Select */}
      <Select
        label="결재상태"
        options={approvalStatusOptions}
        value={approvalStatus}
        onChange={onApprovalStatusChange}
        placeholder="선택하세요"
        disabled={disabled}
      />
    </div>
  );
};

export default ApprovalSearch;
