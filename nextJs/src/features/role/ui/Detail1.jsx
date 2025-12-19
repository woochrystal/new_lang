'use client';

import React from 'react';
import styles from '@/shared/ui/uploadBox/uploadBox.module.scss';

const RoleDetail = function ({ role, isSelected, onClick }) {
  return (
    <div
      className={`${styles.controlBox} ${styles.controlData} ${isSelected ? styles.selected : ''}`}
      onClick={() => onClick(role.authId)}
    >
      <div className={styles.ctrlBoxLeft}>
        <div className={styles.ctrlLfTxtWrap}>
          <h4>{role.authNm}</h4>
          {role.authDesc && <p>{role.authDesc}</p>}
        </div>
      </div>
      <div className={styles.ctrlBoxRight}>
        <span>{role.usrCnt || 0}명</span>
      </div>
    </div>
  );
};

export default RoleDetail;
