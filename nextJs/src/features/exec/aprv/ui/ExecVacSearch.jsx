import { Input, Select } from '@/shared/component';

/**
 * 임원 휴가 현황 검색 컴포넌트
 * 연도, 결재상태, 기안자 검색 필터를 제공합니다.
 */
const ExecVacSearch = (props) => {
  const {
    yearOptions = [],
    searchYear = '',
    onYearChange,
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
      {/* 연도 */}
      <Select label="연도" options={yearOptions} value={searchYear} onChange={onYearChange} disabled={disabled} />

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

export default ExecVacSearch;
