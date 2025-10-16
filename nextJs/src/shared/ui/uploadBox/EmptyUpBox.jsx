'use client';
import styles from '@/shared/ui/uploadBox/uploadBox.module.scss';

export default function EmptyUpBox() {
  return (
    <div className={`${styles.uploadBox} ${styles.emptyBox}`}>
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
}
