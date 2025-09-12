/**
 * @fileoverview BrandingSection 컴포넌트
 * @description 로그인/랜딩 페이지에서 사용하는 브랜딩 섹션
 */

import styles from './BrandingSection.module.scss';

/**
 * 브랜딩 섹션 컴포넌트
 * @param {Object} props
 * @param {string} [props.title] - 메인 타이틀
 * @param {string} [props.subtitle] - 서브 타이틀
 * @param {string|string[]} [props.descriptions] - 설명 텍스트 (문자열 또는 배열)
 * @param {string} [props.className] - 추가 CSS 클래스
 */
export const BrandingSection = ({
  title = '펜타웨어',
  subtitle = '기업 맞춤형 IT 솔루션',
  descriptions = ['기업의 홈페이지 관리와', '그룹웨어 서비스를 모두 제공합니다.'],
  className = '',
  ...props
}) => {
  const sectionClasses = [styles.brandingSection, className].filter(Boolean).join(' ');
  const descriptionArray = Array.isArray(descriptions) ? descriptions : [descriptions];

  return (
    <section className={sectionClasses} {...props}>
      <div className={styles.brandingContent}>
        {' '}
        {/* 추후 이미지로 교체 必*/}
        <h2 className={styles.brandSubtitle}>{subtitle}</h2>
        <h1 className={styles.brandTitle}>{title}</h1>
        {descriptionArray.map((desc, index) => (
          <p key={index} className={styles.brandDescription}>
            {desc}
          </p>
        ))}
      </div>
    </section>
  );
};

export default BrandingSection;
