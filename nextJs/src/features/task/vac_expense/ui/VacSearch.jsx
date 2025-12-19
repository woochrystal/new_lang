import { Select, Label } from '@/shared/component';

//공통디자인 scss
import layoutStyles from '@/shared/component/layout/layout.module.scss';

/**
 * 휴가 검색 바 컴포넌트
 * 연도와 결재상태 필터를 제공합니다.
 */
const VacSearch = (props) => {
  const {
    yearOptions = [],
    searchYear = '',
    onYearChange,
    approvalStatusOptions = [],
    approvalStatus = 'all',
    onApprovalStatusChange,
    disabled = false
  } = props;

  return (
    <>
      {/* 연도 */}
      <div>
        <Select label="연도" options={yearOptions} value={searchYear} onChange={onYearChange} disabled={disabled} />
      </div>

      {/* 결재상태 */}
      <div>
        <Select
          label="결재상태"
          options={approvalStatusOptions}
          value={approvalStatus}
          onChange={onApprovalStatusChange}
          disabled={disabled}
        />
      </div>
    </>
  );
};

export default VacSearch;
