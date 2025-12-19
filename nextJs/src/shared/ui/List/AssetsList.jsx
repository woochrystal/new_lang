import styles from './list.module.scss';

export default function AssetsList() {
  return (
    <ul className={styles.listBasic}>
      <li className={`${styles.listBasicLi} ${styles.assetLi}`}>
        <ol>
          <li>
            <span className={styles.assetsLiName}>장비명:</span>
            <span className={styles.assetsLiData}>모니터</span>
          </li>
          <li>
            <span className={styles.assetsLiName}>자산번호:</span>
            <span className={styles.assetsLiData}>NT-001</span>
          </li>
          <li>
            <span className={styles.assetsLiName}>모델명:</span>
            <span className={styles.assetsLiData}>NT960QFG-K71AR</span>
          </li>
        </ol>
      </li>

      <li className={`${styles.listBasicLi} ${styles.assetLi}`}>
        <ol>
          <li>
            <span className={styles.assetsLiName}>장비명:</span>
            <span className={styles.assetsLiData}>모니터</span>
          </li>
          <li>
            <span className={styles.assetsLiName}>자산번호:</span>
            <span className={styles.assetsLiData}>NT-001</span>
          </li>
          <li>
            <span className={styles.assetsLiName}>모델명:</span>
            <span className={styles.assetsLiData}>NT960QFG-K71AR</span>
          </li>
        </ol>
      </li>
    </ul>
  );
}
