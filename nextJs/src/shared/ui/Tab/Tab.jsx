'use client';

import React from 'react';
import styles from './Tab.module.scss';

function Tab({ tabs = [], activeTab = 0, onTabChange, className = '', ...props }) {
  if (!tabs || tabs.length === 0) return null;

  return (
    <div className={`${styles.tabContainer} ${className}`} {...props}>
      {tabs.map((tab, index) => (
        <div key={index} className={styles.tabItem}>
          <button
            onClick={() => onTabChange && onTabChange(index)}
            className={`${styles.tabButton} ${activeTab === index ? styles.active : ''}`}
          >
            {tab.label}
          </button>
        </div>
      ))}
    </div>
  );
}

export default Tab;
