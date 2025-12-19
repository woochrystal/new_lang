/**
 * Search 컴포넌트 (<search> 태그 래핑)
 *
 * 검색 기능을 위한 의미론적 컨테이너입니다.
 *
 * @param {Object} props
 * @param {string} [props.className] - 추가 CSS 클래스
 * @param {React.ReactNode} props.children - 검색 폼 요소
 * @param {Object} props...rest - HTML <search> 네이티브 속성
 *
 * @example
 * <Search>
 *   <form onSubmit={handleSearch}>
 *     <Input type="search" placeholder="검색..." />
 *     <Button type="submit">검색</Button>
 *   </form>
 * </Search>
 */
const Search = ({ className = '', ...rest }) => {
  return <search className={className} {...rest} />;
};

export default Search;
