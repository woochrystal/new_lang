'use client';
import styles from './title.module.scss';

/**
 * 브랜드 정보 컴포넌트
 * @param {Object} props
 * @param {string} props.logosrc - 로고 이미지 URL
 * @param {string} props.brandname - 브랜드명
 * @param {string} [props.logoAlt='로고'] - 로고 이미지 alt 텍스트
 * @param {string} [props.className] - 추가 CSS 클래스
 * @param {React.Ref<HTMLDivElement>} [props.ref] - 컨테이너 div에 전달할 ref
 */
export const BrandInfo = ({ info = {}, className = '', ...rest }, ref) => {
  const containerClasses = [styles.brandInfo, className].filter(Boolean).join(' ');

  return (
    <div ref={ref} className={containerClasses} {...rest}>
      <img src={info.logoimg} alt={`${info.brandname} 로고`} />
      <h1>{info.brandname}</h1>
    </div>
  );
};

export default BrandInfo;
