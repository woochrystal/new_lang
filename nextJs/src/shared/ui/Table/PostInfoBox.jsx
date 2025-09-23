'use client';
import styles from './table.module.scss';

export default function PostInfoBox({ children, colWidths = [] }) {
  return (
    <div className={`${styles.postInfoBox}`}>
      <table className={styles.table}>
        <colgroup>
          {colWidths.map((width, i) => (
            <col key={i} style={{ width }} />
          ))}
        </colgroup>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
