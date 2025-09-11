'use client';
import { useEffect, useState } from 'react';
import styles from './tableList.module.scss';
import Pagination from './pagination';
export default function TableLayout({ theadList, tbodyList }) {
  // 목록 최신순으로 나열 필요
  return (
    <div className={styles.listLayout}>
      <div>
        <table>
          <colgroup></colgroup>
          <thead>
            <tr>
              <th>No.</th>

              {/* 테이블 헤더명 th*/}
              {theadList.map((type, i) => {
                return <th key={i}>{type}</th>;
              })}
            </tr>
          </thead>
          <tbody>
            {/* 테이블 바디 tr*/}
            {tbodyList.map((type, i) => {
              return (
                <tr key={i}>
                  {/* 테이블 바디 td*/}
                  {type.map((data, index) => {
                    if (index == 0) {
                      return (
                        <td className={styles.numberTd} key={index}>
                          {i + 1}
                        </td>
                      );
                    } else {
                      return <td key={index}>{data}</td>;
                    }
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <Pagination />
    </div>
  );
}
