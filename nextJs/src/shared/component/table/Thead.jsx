import styles from './table.module.scss';

/**
 * 테이블 헤더 컴포넌트 (<thead> 태그 래핑)
 *
 * 테이블의 헤더 행 그룹입니다.
 *
 * @param {Object} props
 * @param {string} [props.className] - 추가 CSS 클래스
 * @param {React.ReactNode} props.children - 헤더 행 내용 (Tr)
 * @param {Object} props...rest - HTML <thead> 네이티브 속성
 *
 * @example
 * <Thead>
 *   <Tr>
 *     <Th>이름</Th>
 *     <Th>이메일</Th>
 *   </Tr>
 * </Thead>
 */
const Thead = ({ className = '', ...rest }) => {
  return <thead className={`${styles.thead} ${className}`} {...rest} />;
};

export default Thead;
