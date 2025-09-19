//Table, Tablecell.jsx랑 같이 사용 필수

'use client';
import PostInfoTableCell from './TableCell';
import styles from './table.module.scss';

export default function PostInfoTableRow({ row, index }) {
  return (
    <tr key={index}>
      {row.map((cell, i) => (
        <PostInfoTableCell key={i}>{cell}</PostInfoTableCell>
      ))}
    </tr>
  );
}
