'use client';
import { useEffect, useState } from 'react';
import styles from "@/shared/ui/Input/radioCustom.module.scss"

export default function RadioBtn({radioInfo}) {
  const {radioTit, value, checked, onChange} = radioInfo;

  return (
    <label className={styles.radioCustom}>
      <input  type='radio' 
              radioTit={radioTit}
              value={value}
              checked={checked}
              onChange={onChange}
      />
      <span>{radioTit}</span>
    </label>
  );
}
