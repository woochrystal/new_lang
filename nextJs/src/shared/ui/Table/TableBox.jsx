// 하나씩 쪼갠 table 컨포넌트 + pagenation 합본
'use client';
import Table from './Table';
import TableHeader from './TableHeader';
import TableBody from './TableBody';
import Pagination from './Pagination';
import styles from './table.module.scss';

export default function TableBox({ theadList, tbodyList }) {
  return (
    <div className={styles.tableLayout}>
      <Table>
        <TableHeader columns={theadList} />
        <TableBody rows={tbodyList} />
      </Table>
      <Pagination />
    </div>
  );
}
