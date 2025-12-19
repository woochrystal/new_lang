import styles from './container.module.scss';

/**
 * Footer 컴포넌트 (<footer> 태그 래핑)
 *
 * 페이지 또는 섹션의 푸터 영역입니다.
 *
 * @param {Object} props
 * @param {string} [props.className] - 추가 CSS 클래스
 * @param {React.ReactNode} props.children - 푸터 내용
 * @param {Object} props...rest - HTML <footer> 네이티브 속성
 *
 * @example
 * <Footer>
 *   <p>Copyright 2025</p>
 * </Footer>
 */
export const Footer = ({ className = '', ...rest }) => {
  return <footer className={className} {...rest} />;
};

export default Footer;
