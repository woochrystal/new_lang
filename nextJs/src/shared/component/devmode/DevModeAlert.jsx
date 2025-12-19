/*
 * 변경 이력:
 * 2025-11-11: permissionService → devMode import 경로 변경
 */
'use client';

import { useState } from 'react';
import { shouldShowDevAlert } from '@/shared/auth';
import styles from './DevModeAlert.module.scss';

/**
 * 개발 모드 알림 컴포넌트
 * @param {Object} props - 컴포넌트 props
 * @param {Object} props.user - 사용자 정보
 * @param {boolean} [props.hasPermissionIssue=false] - 권한 부족 여부
 * @param {string[]} [props.requiredPermissions=[]] - 필요한 권한 목록
 * @returns {React.ReactNode|null}
 */
export const DevModeAlert = ({ user, hasPermissionIssue = false, requiredPermissions = [] }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // DevMode Alert 표시 여부 확인
  if (!shouldShowDevAlert()) {
    return null;
  }

  const statusClass = hasPermissionIssue ? styles.warning : styles.success;
  const statusText = hasPermissionIssue ? '권한 부족' : '인증 우회';
  const statusIcon = hasPermissionIssue ? '⚠️' : '';

  return (
    <div className={`${styles.devAlert} ${statusClass}`}>
      <div className={styles.header} onClick={() => setIsExpanded(!isExpanded)}>
        <span className={styles.icon}>{statusIcon}</span>
        <span className={styles.title}>
          DEV: {user?.usrNm || '개발자'} ({statusText})
        </span>
        <span className={styles.toggle}>{isExpanded ? '▼' : '▶'}</span>
      </div>

      {isExpanded && (
        <div className={styles.details}>
          <div className={styles.section}>
            <strong>사용자 정보:</strong>
            <ul>
              <li>ID: {user?.usrId || 'N/A'}</li>
              <li>이름: {user?.usrNm || 'N/A'}</li>
              <li>역할: {user?.usrRole || 'N/A'}</li>
              <li>테넌트: {user?.tenantId || 'N/A'}</li>
            </ul>
          </div>

          <div className={styles.section}>
            <strong>권한 정보:</strong>
            <ul>
              <li>보유 권한: {user?.permissions?.length || 0}개</li>
              {user?.permissions?.slice(0, 3).map((perm, idx) => (
                <li key={idx} className={styles.permission}>
                  • {perm}
                </li>
              ))}
              {user?.permissions?.length > 3 && <li className={styles.more}>... 외 {user.permissions.length - 3}개</li>}
            </ul>
          </div>

          {hasPermissionIssue && requiredPermissions.length > 0 && (
            <div className={styles.section}>
              <strong className={styles.required}>필요한 권한:</strong>
              <ul>
                {requiredPermissions.map((perm, idx) => (
                  <li key={idx} className={styles.missing}>
                    ✗ {perm}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className={styles.warning}>운영 환경에서는 NEXT_PUBLIC_SHOW_DEV_ALERT=false로 설정하세요</div>
        </div>
      )}
    </div>
  );
};

export default DevModeAlert;
