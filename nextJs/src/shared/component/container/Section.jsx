import styles from './container.module.scss';

/**
 * Section 컴포넌트 (<section> 태그 래핑)
 *
 * 의미론적 섹션 구분을 위한 컨테이너입니다.
 *
 * @param {Object} props
 * @param {string} [props.className] - 추가 CSS 클래스
 * @param {React.ReactNode} props.children - 섹션 내용
 * @param {Object} props...rest - HTML <section> 네이티브 속성
 *
 * @example
 * <Section>
 *   <h2>섹션 제목</h2>
 *   <p>섹션 내용</p>
 * </Section>
 */
export const Section = ({ className = '', ...rest }) => {
  return <section className={className} {...rest} />;
};

export default Section;
