'use client';
import styles from './brandInfo.module.scss';

export default function BrandInfo({ BrandInfo }) {
  const { logoimg, brandname } = BrandInfo;
  return (
    <div className={styles.brandInfo}>
      <img src={logoimg} alt="로고" />
      <h1>{brandname}</h1>
    </div>
  );
}
