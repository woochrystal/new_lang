'use client';
import PostInfoTable from './PostInfoTable';
import styles from './table.module.scss';

export default function PostInfoBox({ children }) {
  return (
    <div className={`${styles.postInfoBox}`}>
      <PostInfoTable>{children}</PostInfoTable>
    </div>
  );
}
