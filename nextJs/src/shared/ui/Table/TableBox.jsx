// 하나씩 쪼갠 table 컨포넌트 + pagenation 합본
'use client';
import Table from './Table';
import TableHeader from './TableHeader';
import TableBody from './TableBody';
import styles from './table.module.scss';

export default function TableBox() {
  return (
    // <div className={styles.tableLayout}>
    //   <Table>
    //     <TableHeader columns={theadList} />
    //     <TableBody rows={tbodyList} />
    //   </Table>
    // </div>
    <div className={styles.tableLayout}>
      <table>
        <colgroup></colgroup>
        <thead>
          <tr>
            <th>No.</th>
            <th>상신 일시</th>
            <th>기안자</th>
            <th>기안 부서</th>
            <th>휴가 종류</th>
            <th>휴가 기간</th>
            <th>휴가 일수</th>
            <th>진행 상태</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className={styles.numberTd}>1</td>
            <td>2025-08-25 14:14:14</td>
            <td>홍길동</td>
            <td>전략기획부</td>
            <td>연차</td>
            <td>2025-08-25 14:14:14</td>
            <td>2</td>
            <td>승인</td>
          </tr>
          <tr>
            <td className={styles.numberTd}>2</td>
            <td>2025-08-26 14:14:15</td>
            <td>김길동</td>
            <td>전략기획</td>
            <td>반차</td>
            <td>2025-08-25 14:14:15</td>
            <td>1</td>
            <td>승인</td>
          </tr>
          <tr>
            <td className={styles.numberTd}>3</td>
            <td>2025-08-25 14:14:14</td>
            <td>홍길동</td>
            <td>전략기획부</td>
            <td>연차</td>
            <td>2025-08-25 14:14:14</td>
            <td>2</td>
            <td>승인</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
