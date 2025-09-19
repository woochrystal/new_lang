// 테이블만(tableBox 사용해야함)
'use client';
import styles from './table.module.scss';

export default function PostInfoTable({ children }) {
  return (
    <div>
      <table className={styles.table}>{children}</table>
    </div>
  );
}
