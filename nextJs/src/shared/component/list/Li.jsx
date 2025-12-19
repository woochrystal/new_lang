import styles from './list.module.scss';

/**
 * Li 컴포넌트 (<li> 태그 래핑)
 *
 * 리스트 항목입니다.
 *
 * @param {Object} props
 * @param {string} [props.className] - 추가 CSS 클래스
 * @param {React.ReactNode} props.children - 리스트 항목 내용
 * @param {Object} props...rest - HTML <li> 네이티브 속성
 *
 * @example
 * <Ul>
 *   <Li>항목 1</Li>
 *   <Li>항목 2</Li>
 * </Ul>
 */
const Li = ({ className = '', ...rest }) => {
  return <li className={className} {...rest} />;
};

export default Li;
