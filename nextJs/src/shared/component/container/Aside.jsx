import styles from './container.module.scss';

/**
 * Aside 컴포넌트 (<aside> 태그 래핑)
 *
 * 부가적인 콘텐츠 영역입니다 (사이드바, 광고 등).
 *
 * @param {Object} props
 * @param {string} [props.className] - 추가 CSS 클래스
 * @param {React.ReactNode} props.children - 사이드 콘텐츠
 * @param {Object} props...rest - HTML <aside> 네이티브 속성
 *
 * @example
 * <Aside>
 *   <h3>관련 링크</h3>
 *   <Ul>
 *     <Li><A href="#">링크1</A></Li>
 *   </Ul>
 * </Aside>
 */
export const Aside = ({ className = '', ...rest }) => {
  return <aside className={className} {...rest} />;
};

export default Aside;
