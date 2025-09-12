/**
 * @fileoverview Footer 컴포넌트
 * @description 푸터 컴포넌트
 */

import styles from './Footer.module.scss';

/**
 * 공용 푸터 컴포넌트
 * @param {Object} props
 * @param {string} [props.className] - 추가 CSS 클래스
 */
export const Footer = ({ className = '', ...props }) => {
  const footerClasses = [styles.footer, className].filter(Boolean).join(' ');

  return (
    <footer className={footerClasses} {...props}>
      <div className={styles.footerContent}>
        <div className={styles.footerBrand}>
          <div className={styles.footerLogo}>PentaS</div>
          {/* 로고 이미지로 교체 必*/}
          <div className={styles.footerInfo}>
            서울특별시 강서구 양천로 532번지 508호 (가양역 더리브 아너비즈타워)
            <br />
            Tel 02-6952-9608 | Fax 02-6020-9608 | Email pentasceo@gmail.com | 대표이사 박태영
          </div>
        </div>
        <div className={styles.footerCopyright}>Copyright ⓒ (주)펜타에스. All rights Reserved</div>
      </div>
    </footer>
  );
};

export default Footer;
