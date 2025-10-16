import React, { useEffect, useState } from 'react';
import styles from './title.module.scss';

// 각 영역 좌상단 라벨부분(명칭 ex-메인화면의 전자결재, 보유장비현황)

const ContLabel = ({ className = '', title = [], ...rest }, ref) => {
  // console.log(title.length);
  // const [titnum, setTitnum] = useState(title.le);
  // contLabel: 기본className
  const containerClasses = [styles.contLabel, className].filter(Boolean).join(' ');

  return (
    <div ref={ref} className={containerClasses} {...rest}>
      {Array.isArray(title) ? title.map((txt, i) => <span key={i}>{txt}</span>) : <span>{title}</span>}
    </div>
  );
};

export default ContLabel;
