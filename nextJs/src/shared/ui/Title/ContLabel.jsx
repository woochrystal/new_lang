import React, { useEffect, useState } from 'react';
import styles from './title.module.scss';

// 각 영역 좌상단 라벨부분(명칭 ex-메인화면의 전자결재, 보유장비현황)

const ContLabel = () => {
  return (
    <div className={styles.contLabel}>
      <label>지출 품의서</label>
      <label>지출 품의서22</label>
    </div>
  );
};

export default ContLabel;
