import styles from '@/shared/ui/List/list.module.scss';

const NumTag = () => {
  return (
    <ul className={`${styles.listBasic} ${styles.numTagList}`}>
      <li className={styles.numTag}>
        <div className={`${styles.numWrap} ${styles.numPending}`}>
          <span>10</span>
        </div>
        <span>미결문서</span>
      </li>

      <li className={styles.numTag}>
        <div className={`${styles.numWrap} ${styles.numReject}`}>
          <span>7</span>
        </div>
        <span>반려문서</span>
      </li>

      <li className={styles.numTag}>
        <div className={`${styles.numWrap} ${styles.numWaiting}`}>
          <span>3</span>
        </div>
        <span>결재대기</span>
      </li>
    </ul>
  );
};

export default NumTag;
