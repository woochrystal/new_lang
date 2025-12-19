'use client';

import styles from './ApprovalLine.module.scss';

/**
 * 결재선 추가 버튼 (EmptyUpBox와 동일한 디자인)
 * @param {Object} props
 * @param {Function} props.onClick - 클릭 이벤트 핸들러
 */
const ApprovalLineEmptyBox = ({ onClick }) => {
  return (
    <div className={`${styles.uploadBox} ${styles.emptyBox}`} onClick={onClick} style={{ cursor: 'pointer' }}>
      <div>
        <div className={styles.plusWrap}>
          <img src="/uploadPlus.svg" alt="추가" />
        </div>
      </div>
      <div className={styles.uploadBoxName}>
        <span>결재선 추가</span>
      </div>
    </div>
  );
};

export default ApprovalLineEmptyBox;
