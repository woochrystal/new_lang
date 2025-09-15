//Table, Tablecell.jsx랑 같이 사용 필수

'use client';
import TableCell from './TableCell';
import styles from './table.module.scss';

export default function TableRow({ row, index }) {
  return (
    <tr key={index}>
      <TableCell className={styles.numberTd}>{index + 1}</TableCell>
      {row.slice(1).map(
        (
          cell,
          i //첫번째는 숫자로 두기(제외하고 map 돌림)
        ) => (
          <TableCell key={i}>{cell}</TableCell>
        )
      )}
    </tr>
  );
}
