import styles from './container.module.scss';

/**
 * Header 컴포넌트 (<header> 태그 래핑)
 *
 * 페이지 또는 섹션의 헤더 영역입니다.
 *
 * @param {Object} props
 * @param {string} [props.className] - 추가 CSS 클래스
 * @param {React.ReactNode} props.children - 헤더 내용
 * @param {Object} props...rest - HTML <header> 네이티브 속성
 *
 * @example
 * <Header>
 *   <Nav />
 * </Header>
 */
export const Header = ({ className = '', ...rest }) => {
  return <header className={className} {...rest} />;
};

export default Header;
