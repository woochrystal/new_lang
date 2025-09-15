//Table, TableRow.jsx랑 같이 사용 필수
'use client';
import styles from './table.module.scss';

export default function TableCell({ children, className }) {
  return <td className={`${styles.numberTd} ${className || ''}`}>{children}</td>;
}
