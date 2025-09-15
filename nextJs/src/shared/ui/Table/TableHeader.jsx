'use client';
export default function TableHeader({ columns }) {
  return (
    <thead>
      <tr>
        <th>No.</th>
        {columns.map((col, i) => (
          <th key={i}>{col}</th>
        ))}
      </tr>
    </thead>
  );
}
