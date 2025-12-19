import styles from './container.module.scss';

/**
 * Nav 컴포넌트 (<nav> 태그 래핑)
 *
 * 네비게이션 링크 모음입니다.
 *
 * @param {Object} props
 * @param {string} [props.className] - 추가 CSS 클래스
 * @param {React.ReactNode} props.children - 네비게이션 내용
 * @param {Object} props...rest - HTML <nav> 네이티브 속성
 *
 * @example
 * <Nav>
 *   <Ul>
 *     <Li><A href="/home">홈</A></Li>
 *     <Li><A href="/about">소개</A></Li>
 *   </Ul>
 * </Nav>
 */
export const Nav = ({ className = '', ...rest }) => {
  return <nav className={className} {...rest} />;
};

export default Nav;
