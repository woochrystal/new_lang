import styles from './list.module.scss';

/**
 * Ol 컴포넌트 (<ol> 태그 래핑)
 *
 * 순서가 있는 리스트입니다.
 *
 * @param {Object} props
 * @param {number} [props.start] - 시작 번호
 * @param {'1'|'a'|'A'|'i'|'I'} [props.type='1'] - 리스트 표시 타입
 * @param {string} [props.className] - 추가 CSS 클래스
 * @param {React.ReactNode} props.children - Li 요소들
 * @param {Object} props...rest - HTML <ol> 네이티브 속성
 *
 * @example
 * <Ol>
 *   <Li>첫 번째</Li>
 *   <Li>두 번째</Li>
 * </Ol>
 */
const Ol = ({ className = '', ...rest }) => {
  return <ol className={`${styles.list} ${className}`.trim()} {...rest} />;
};

export default Ol;
