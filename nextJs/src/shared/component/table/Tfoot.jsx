import styles from './table.module.scss';

/**
 * 테이블 푸터 컴포넌트 (<tfoot> 태그 래핑)
 *
 * 테이블의 푸터 행 그룹입니다. (선택)
 *
 * @param {Object} props
 * @param {string} [props.className] - 추가 CSS 클래스
 * @param {React.ReactNode} props.children - 푸터 행 내용 (Tr)
 * @param {Object} props...rest - HTML <tfoot> 네이티브 속성
 *
 * @example
 * <Tfoot>
 *   <Tr>
 *     <Td>합계</Td>
 *     <Td>100명</Td>
 *   </Tr>
 * </Tfoot>
 */
const Tfoot = ({ className = '', ...rest }) => {
  return <tfoot className={`${styles.tfoot} ${className}`} {...rest} />;
};

export default Tfoot;
