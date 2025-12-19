'use client';

import React from 'react';
import { Tree, Button, Label } from '@/shared/component';
import { MenuSearch } from '@/features/role';
import styles from '@/shared/component/layout/layout.module.scss';

const RoleMenuTree = function ({
  searchKeyword,
  onSearchChange,
  onSearch,
  onClearSearch,
  treeData,
  checkedKeys,
  onCheckedChange,
  expandedKeys,
  onExpandedChange,
  loading,
  selectedRoleId,
  isCreating,
  isEditing,
  onSave,
  onReset,
  hideActions
}) {
  if (isEditing) {
    return <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>권한 정보 수정 중입니다.</div>;
  }

  return (
    <>
      <div className={`${styles.titleSection} ${styles.titleWithButtonSection}`}>
        <div className={styles.sectionTitle}>
          <h3>권한에 연결될 메뉴를 선택합니다.</h3>
          {(selectedRoleId || isCreating) && !hideActions && (
            <div className={styles.actionButtonContainer}>
              <Button variant="secondary" onClick={onSave}>
                저장
              </Button>
              <Button variant="danger" onClick={onReset}>
                초기화
              </Button>
            </div>
          )}
        </div>
        <Label required>필수 입력 정보입니다.</Label>
      </div>

      <div className={`${styles.depthSection} ${styles.noBgBd}`}>
        <div>
          <MenuSearch
            value={searchKeyword}
            onChange={onSearchChange}
            onSearch={onSearch}
            onClear={onClearSearch}
            placeholder="검색어를 입력해주세요"
            disabled={loading || isEditing}
          />
        </div>

        {loading ? (
          <div>로딩 중...</div>
        ) : !selectedRoleId && !isCreating ? (
          <div>권한을 선택해주세요.</div>
        ) : treeData.length === 0 ? (
          <div>메뉴가 없습니다.</div>
        ) : (
          <Tree
            data={treeData}
            selectionMode="checkbox"
            disableFolderCheckbox={false}
            checkedKeys={checkedKeys}
            onCheckedChange={onCheckedChange}
            expandedKeys={expandedKeys}
            onExpandedChange={onExpandedChange}
            disabled={!isCreating && !selectedRoleId}
          />
        )}
      </div>
    </>
  );
};

export default RoleMenuTree;
