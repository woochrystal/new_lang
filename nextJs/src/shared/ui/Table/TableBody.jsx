'use client';
import TableRow from './TableRow';

export default function TableBody({ rows }) {
  return (
    <tbody>
      {rows.map((row, i) => (
        <TableRow key={i} index={i} row={row} />
      ))}
    </tbody>
  );
}
