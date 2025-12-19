'use client';

// ============================================================================
// Imports
// ============================================================================
import { useCallback, useMemo, useState } from 'react';
import { Input, Button, Drawer, Tag, Label } from '@/shared/component';
import styles from './approval.module.scss';

// ============================================================================
// Component
// ============================================================================
export const ApprovalStatus = ({
  value = {},
  onChange,
  onDelete,
  approverList = [],
  disabled = false,
  readOnly = false,
  error,
  className = '',
  datetime,
  ...rest
}) => {
  // ==========================================================================
  // Data (상태 관리)
  // ==========================================================================

  const [tempValue, setTempValue] = useState(value);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // ==========================================================================
  // Computed (계산된 값)
  // ==========================================================================
  const hasValue = useMemo(() => value && value.name, [value]);

  const wrapperClasses = useMemo(() => {
    return [
      styles.approvalStatus,
      disabled && styles.disabled,
      readOnly && styles.readOnly,
      error && styles.error,
      !readOnly && !hasValue && styles.noValue,
      className
    ]
      .filter(Boolean)
      .join(' ');
  }, [disabled, readOnly, error, className, hasValue]);

  const [date, time] = useMemo(() => (datetime ? datetime.split(' ') : [null, null]), [datetime]);

  // 검색된 담당자 목록
  const filteredApprovers = useMemo(() => {
    if (!searchQuery) return approverList;
    return approverList.filter(
      (approver) => approver.name?.includes(searchQuery) || approver.team?.includes(searchQuery)
    );
  }, [approverList, searchQuery]);

  // ==========================================================================
  // Methods (메서드)
  // ==========================================================================

  const handleOpen = useCallback(() => {
    if (!disabled && !readOnly) {
      setTempValue(value);
      setSearchQuery('');
      setIsDrawerOpen(true);
    }
  }, [disabled, readOnly, value]);

  const handleSelectApprover = useCallback((approver) => {
    setTempValue(approver);
  }, []);

  const handleConfirm = useCallback(() => {
    onChange?.(tempValue);
    setIsDrawerOpen(false);
  }, [tempValue, onChange]);

  const handleCancel = useCallback(() => {
    setIsDrawerOpen(false);
  }, []);

  const handleDelete = useCallback(
    (e) => {
      e.stopPropagation();
      onDelete?.();
    },
    [onDelete]
  );

  // ==========================================================================
  // Render (렌더링)
  // ==========================================================================

  return (
    <>
      <div
        className={wrapperClasses}
        onClick={!readOnly ? handleOpen : undefined}
        role="button"
        tabIndex={disabled || readOnly ? -1 : 0}
        aria-label={
          readOnly ? `${value.name} ${value.status}` : hasValue ? `${value.name} 결재자, 클릭하여 변경` : '결재선 추가'
        }
        aria-disabled={disabled}
        onKeyDown={(e) => {
          if (!disabled && !readOnly && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            handleOpen();
          }
        }}
        {...rest}
      >
        {/* --- 1. 상단 영역 --- */}
        <div className={styles.contentArea}>
          {/* 삭제 버튼 (편집 모드 전용) */}
          {onDelete && (
            <button className={styles.deleteButton} onClick={handleDelete}>
              ×
            </button>
          )}

          {/* 상태 태그 (readOnly 전용) */}
          <div className={styles.statusWrapper}>{value.status && <Tag variant="text" status={value.status} />}</div>

          {/* 날짜 (readOnly 전용) */}
          <div className={styles.dateWrapper}>
            {date && <span>{date}</span>}
            {time && <span>{time}</span>}
          </div>

          {/* 팀 이름 (편집 모드 & 값 있을 때) */}
          <div className={styles.teamNameWrapper}>{value.team}</div>

          {/* '결재선 추가' UI (편집 모드 & 값 없을 때) */}
          <div className={styles.addWrapper}>
            <div className={styles.addButton}>
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M14 6V22M6 14H22"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className={styles.addText}>결재선 추가</div>
          </div>
        </div>

        {/* --- 2. 하단 영역 --- */}
        <div className={styles.approverArea}>
          <span className={styles.approverName}>{hasValue || readOnly ? value.name : '결재선 추가'}</span>

          {/* 검색 아이콘 (편집 모드 전용) */}
          <div className={styles.searchIconWrapper}>
            <svg className={styles.searchIcon} width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
              <line x1="12.5" y1="12.5" x2="17.5" y2="17.5" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </div>
        </div>
      </div>

      {/* Drawer */}
      <Drawer isOpen={isDrawerOpen} onClose={handleCancel} title="결재자 선택">
        <div className={styles.drawerContent}>
          <Label htmlFor="aaa" size="md">
            조직도를 조회합니다.
          </Label>
          <Input
            id="aaa"
            placeholder="검색어를 입력해주세요"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            variant="search"
            onSearch={() => {}}
            onClear={() => setSearchQuery('')}
          />
          <div className={styles.approverList}>
            <span>추후 트리로 변경 예정</span>
            {filteredApprovers.length > 0 ? (
              filteredApprovers.map((approver, index) => (
                <div
                  key={`${approver.name}-${index}`}
                  className={`${styles.approverItem} ${tempValue.name === approver.name ? styles.selected : ''}`}
                  onClick={() => handleSelectApprover(approver)}
                  role="option"
                  aria-selected={tempValue.name === approver.name}
                >
                  <div className={styles.approverItemInfo}>
                    <span className={styles.approverItemName}>{approver.name}</span>
                    {approver.team && <span className={styles.approverItemTeam}>{approver.team}</span>}
                  </div>
                  {approver.position && <span className={styles.approverItemPosition}>{approver.position}</span>}
                </div>
              ))
            ) : (
              <div className={styles.noResults}>검색 결과가 없습니다.</div>
            )}
          </div>
          <div className={styles.drawerActions}>
            <Button variant="secondary" onClick={handleCancel}>
              취소
            </Button>
            <Button onClick={handleConfirm} disabled={!tempValue.name}>
              확인
            </Button>
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default ApprovalStatus;
