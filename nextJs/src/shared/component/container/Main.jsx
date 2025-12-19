import styles from './container.module.scss';

/**
 * Main 컴포넌트 (<main> 태그 래핑)
 *
 * 페이지의 주요 콘텐츠 영역입니다.
 * 페이지당 하나만 사용해야 합니다.
 *
 * @param {Object} props
 * @param {string} [props.className] - 추가 CSS 클래스
 * @param {React.ReactNode} props.children - 메인 콘텐츠
 * @param {Object} props...rest - HTML <main> 네이티브 속성
 *
 * @example
 * <Main>
 *   <Section>...</Section>
 * </Main>
 */
export const Main = ({ className = '', ...rest }) => {
  return <main className={className} {...rest} />;
};
