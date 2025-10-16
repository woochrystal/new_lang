import styles from './list.module.scss';

/**
 * 메인화면 보유장비현황 리스트 컴포넌트
 * @param {Object} props
 * @param {string} props.name - 장비명
 * @param {string|number} props.num - 자산번호
 * @param {string} props.code - 모델명 (코드)
 */

export default function AssetsList({ name, num, code }) {
  return (
    <li className={`${styles.listBasicLi} ${styles.assetLi}`}>
      <ol>
        <li>
          <span className={styles.assetsLiName}>장비명:</span>
          <span className={styles.assetsLiData}>{name}</span>
        </li>
        <li>
          <span className={styles.assetsLiName}>자산번호:</span>
          <span className={styles.assetsLiData}>{num}</span>
        </li>
        <li>
          <span className={styles.assetsLiName}>모델명:</span>
          <span className={styles.assetsLiData}>{code}</span>
        </li>
      </ol>
    </li>
  );
}
