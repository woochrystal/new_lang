import styles from './list.module.scss';

/**
 * Ul 컴포넌트 (<ul> 태그 래핑)
 *
 * 순서 없는 리스트입니다.
 *
 * @param {Object} props
 * @param {string} [props.className] - 추가 CSS 클래스
 * @param {React.ReactNode} props.children - Li 요소들
 * @param {Object} props...rest - HTML <ul> 네이티브 속성
 *
 * @example
 * <Ul>
 *   <Li>항목 1</Li>
 *   <Li>항목 2</Li>
 * </Ul>
 */
const Ul = ({ className = '', ...rest }) => {
  return <ul className={`${styles.list} ${className}`.trim()} {...rest} />;
};

export default Ul;
