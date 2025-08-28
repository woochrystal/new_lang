'use client';
import { useEffect, useState } from 'react'
import styles from './table.module.scss'
export default function TableLayout(){
    const theadList = ['No.', '상신 일시', '기안자', '기안 부서', '휴가 종류', '휴가 기간', '휴가 일수', '진행 상태']
    const tbodyList = [ '12', '2025-08-25 14:14:14', '홍길동', '전략기획부', '연차', '2025-08-25 14:14:14', '2', '승인']



    return(
        <div className={styles.tableLayout}>
            <div>
                <table>
                    <colgroup>
                    
                    </colgroup>
                    <thead>
                        <tr>

                        </tr>
                    </thead>
                    <tbody>

                    </tbody>
                </table>
            </div>
        </div>
    )
}