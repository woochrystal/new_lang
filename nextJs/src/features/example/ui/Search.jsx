import { Input } from '@/shared/component';

/**
 * 게시판 검색 바 컴포넌트
 * @param {Object} props
 * @param {string} props.value - 현재 검색어
 * @param {Function} props.onChange - 검색어 변경 핸들러
 * @param {Function} props.onSearch - 검색 실행 핸들러 (검색 버튼 클릭 시)
 * @param {Function} props.onClear - 초기화 핸들러 (X 버튼 클릭 시)
 * @param {boolean} [props.disabled=false] - 비활성화 상태
 * @param {string} [props.placeholder='검색...'] - placeholder 텍스트
 */
const ExampleSearch = function (props) {
  const { value, onChange, onSearch, onClear, disabled = false, placeholder = '검색...' } = props;

  return (
    <Input
      variant="search"
      value={value}
      onChange={onChange}
      onSearch={onSearch}
      onClear={onClear}
      placeholder={placeholder}
      disabled={disabled}
    />
  );
};

export default ExampleSearch;
