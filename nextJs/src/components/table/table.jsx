'use client';
import { useEffect, useState } from 'react'
import styles from './table.module.scss'
export default function TableLayout({theadList, tbodyList}){
    return(
        <div className={styles.tableLayout}>
            <div>
                <table>
                    <colgroup>
                    
                    </colgroup>
                    <thead>
                        <tr>
                            <th>No.</th>
                            {
                                theadList.map((type, i)=>{
                                    return <th key={i}>{type}</th>
                                })
                            }
                        </tr>
                    </thead>
                    <tbody>
                            {
                                tbodyList.map((type, i)=>{
                                    return(
                                        <tr key={i}>
                                            {type.map((data, index)=>{
                                            if (index == 0){
                                                return (
                                                <td className={styles.numberTd} key={index}>
                                                    {i + 1}
                                                </td>
                                                )
                                            }else{
                                                return <td key={index}>{data}</td>
                                            }
                                            })}
                                        </tr>
                                    )
                                })
                            }
                    </tbody>
                </table>
            </div>
        </div>
    )
}