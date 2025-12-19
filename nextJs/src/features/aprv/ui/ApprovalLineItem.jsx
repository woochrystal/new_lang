'use client';

import styles from './ApprovalLine.module.scss';

/**
 * 개별 결재자 표시 컴포넌트
 * @param {Object} props
 * @param {Object} props.approver - 결재자 정보
 * @param {Function} props.onRemove - 삭제 핸들러
 */
const ApprovalLineItem = (props) => {
  const { approver, onRemove, onAdd } = props;

  return (
    <div className={styles.uploadBox}>
      <div>
        <div className={styles.plusWrap}>
          <div className={styles.clearBtn} onClick={onRemove}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21 20" fill="none">
              <rect x="0.666504" width="20" height="20" rx="10" />
              <path d="M11.6056 9.99943L14.4695 7.14179C14.5949 7.01635 14.6654 6.84623 14.6654 6.66884C14.6654 6.49146 14.5949 6.32133 14.4695 6.1959C14.3441 6.07047 14.174 6 13.9966 6C13.8193 6 13.6492 6.07047 13.5237 6.1959L10.6665 9.06021L7.80927 6.1959C7.68385 6.07047 7.51375 6 7.33639 6C7.15903 6 6.98893 6.07047 6.86351 6.1959C6.7381 6.32133 6.66764 6.49146 6.66764 6.66884C6.66764 6.84623 6.7381 7.01635 6.86351 7.14179L9.72741 9.99943L6.86351 12.8571C6.80109 12.919 6.75154 12.9927 6.71773 13.0738C6.68391 13.155 6.6665 13.2421 6.6665 13.33C6.6665 13.418 6.68391 13.505 6.71773 13.5862C6.75154 13.6674 6.80109 13.741 6.86351 13.803C6.92543 13.8654 6.99909 13.915 7.08025 13.9488C7.16141 13.9826 7.24847 14 7.33639 14C7.42431 14 7.51136 13.9826 7.59253 13.9488C7.67369 13.915 7.74735 13.8654 7.80927 13.803L10.6665 10.9387L13.5237 13.803C13.5857 13.8654 13.6593 13.915 13.7405 13.9488C13.8216 13.9826 13.9087 14 13.9966 14C14.0845 14 14.1716 13.9826 14.2528 13.9488C14.3339 13.915 14.4076 13.8654 14.4695 13.803C14.5319 13.741 14.5815 13.6674 14.6153 13.5862C14.6491 13.505 14.6665 13.418 14.6665 13.33C14.6665 13.2421 14.6491 13.155 14.6153 13.0738C14.5815 12.9927 14.5319 12.919 14.4695 12.8571L11.6056 9.99943Z" />
            </svg>
          </div>
          <ul className={styles.teamName}>
            <li>{approver.deptNm || '부서 없음'}</li>
          </ul>
        </div>
      </div>
      <div className={styles.uploadBoxName}>
        {/* 이름 및 검색버튼 */}
        <div className={styles.inputSearch}>
          <input type="text" value={approver.usrNm || ''} placeholder="결재자를 검색해주세요." readOnly />
          <button onClick={onAdd}>
            <img src="/search.png" alt="돋보기 아이콘" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApprovalLineItem;
