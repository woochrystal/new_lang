import styles from './container.module.scss';

/**
 * Article 컴포넌트 (<article> 태그 래핑)
 *
 * 독립적인 기사/콘텐츠를 위한 의미론적 컨테이너입니다.
 *
 * @param {Object} props
 * @param {string} [props.className] - 추가 CSS 클래스
 * @param {React.ReactNode} props.children - 기사 내용
 * @param {Object} props...rest - HTML <article> 네이티브 속성
 *
 * @example
 * <Article>
 *   <h2>기사 제목</h2>
 *   <p>기사 내용</p>
 * </Article>
 */
export const Article = ({ className = '', ...rest }) => {
  return <article className={className} {...rest} />;
};
