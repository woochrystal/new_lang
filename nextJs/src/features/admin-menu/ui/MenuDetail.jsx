import React, { useEffect, useState, useMemo, useRef } from 'react';
import { Button, Input, Select, RadioGroup, Content, Label } from '@/shared/component';
import styles from '@/shared/component/layout/layout.module.scss';

const MenuDetail = ({ selectedMenu, mode, parentMenu, treeData, onSave, onDelete, onCancel, onDirtyChange }) => {
  const [formData, setFormData] = useState({});
  const [initialData, setInitialData] = useState({});
  const [iconOptions, setIconOptions] = useState([{ label: '아이콘 없음', value: '' }]);
  const hasUserInteracted = useRef(false); // 사용자가 폼을 수정했는지 추적

  // Fetch Icons
  useEffect(() => {
    const fetchIcons = async () => {
      try {
        const res = await fetch('/api/menu-icons');
        if (res.ok) {
          const data = await res.json();
          if (data.icons) {
            setIconOptions([{ label: '아이콘 없음', value: '' }, ...data.icons]);
          }
        }
      } catch (error) {
        console.error('Failed to fetch icons:', error);
      }
    };
    fetchIcons();
  }, []);

  // treeData를 부모 선택 옵션으로 평탄화
  const parentOptions = useMemo(() => {
    const options = [{ label: '최상위', value: 0 }]; // 0 for ROOT
    if (!treeData) return options;

    const targetList = Array.isArray(treeData) ? treeData : [treeData];

    const traverseNodes = (nodes, depth = 0, excludeId = null) => {
      if (!nodes || nodes.length === 0) return;

      for (const node of nodes) {
        // 제외 로직
        if (excludeId !== null && node.menuId === excludeId) continue;

        // 가상 루트 래핑 건너뛰기
        if (node.menuId === 0) {
          if (node.children) traverseNodes(node.children, depth, excludeId);
          continue;
        }

        // 잠재적 부모만 추가 (깊이 0과 1)
        // 깊이 2+는 부모가 될 수 없음 (부모 선택에 표시되지 않아야 함)
        if (depth < 2) {
          const indent = '\u00A0'.repeat(depth * 2);
          options.push({
            label: `${indent}${node.name}`,
            value: node.menuId
          });
        }

        // Recurse (increment depth)
        // We still need to traverse children even if current node is not added (e.g. if logic was different)
        // But here, if we filtered depth < 2, does recursion matter?
        // Yes, because children of depth 1 are depth 2. We need to process them?
        // Actually, if we are at depth 1, and we have children (depth 2).
        // Recurse -> depth 2. `2 < 2` False. Not added.
        // Recurse -> depth 3. `3 < 2` False. Not added.
        // So we can technically stop recursing if depth >= 1 (since children will be 2).
        // Optimization: if (depth < 1) traverse...
        // Let's keep it simple recursion but strict verify.
        if (node.children) {
          traverseNodes(node.children, depth + 1, excludeId);
        }
      }
    };

    // 편집 모드일 경우 제외할 분기 결정
    let excludeBranchId = null;
    if (mode === 'edit' && selectedMenu) {
      excludeBranchId = selectedMenu.menuId;
    }

    traverseNodes(targetList, 1, excludeBranchId);
    return options;
  }, [treeData, selectedMenu?.menuId, mode]); // selectedMenu.menuId로 최적화

  // 노드의 깊이를 구하는 일반 함수 계산
  const getDepth = (nodes, targetId, currentDepth = 0) => {
    if (!nodes) return -1;
    for (const node of nodes) {
      if (node.menuId === targetId) return currentDepth;
      if (node.children) {
        const childDepth = getDepth(node.children, targetId, currentDepth + 1);
        if (childDepth !== -1) return childDepth;
      }
    }
    return -1;
  };

  // 폼과 initialData 초기화
  useEffect(() => {
    let newInitData = {};
    if (mode === 'create' || mode === 'createSub') {
      const parentId = parentMenu && parentMenu.menuId !== 0 ? parentMenu.menuId : 0; // Default to 0 (Root)
      newInitData = {
        parentId: parentId,
        name: '',
        menuUrl: '',
        menuIcon: '',
        order: parentMenu ? parentMenu.sortOrder || parentMenu.order || 10 : 10,
        assignRole: 'USER',
        useYn: 'Y'
      };
    } else if (selectedMenu) {
      newInitData = {
        menuId: selectedMenu.menuId,
        parentId: selectedMenu.parentId || 0, // Handle null as 0
        name: selectedMenu.name,
        menuUrl: selectedMenu.menuUrl,
        menuIcon: selectedMenu.menuIcon || '',
        order: selectedMenu.sortOrder || selectedMenu.order,
        assignRole: selectedMenu.assignRole,
        useYn: selectedMenu.useYn
      };
    }

    // 메뉴 선택 변경시 우측 페이지 갱신
    setFormData(newInitData);
    setInitialData(newInitData);
    hasUserInteracted.current = false; // 새 메뉴 선택 시 리셋
    if (onDirtyChange) onDirtyChange(false);
  }, [selectedMenu?.menuId, mode, parentMenu]); // menuId로 최적화

  // 변경사항 확인 (단순화됨, parentName 제거됨)
  useEffect(() => {
    if (!onDirtyChange) return;

    const isDifferent = Object.keys(initialData).some((key) => {
      const val1 = formData[key] === null || formData[key] === undefined ? '' : String(formData[key]);
      const val2 = initialData[key] === null || initialData[key] === undefined ? '' : String(initialData[key]);
      return val1 !== val2;
    });
    onDirtyChange(isDifferent);
  }, [formData, initialData]); // 제거: onDirtyChange 함수 불안정성 문제

  const handleChange = (field, value) => {
    hasUserInteracted.current = true; // 사용자 입력 추적
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isReadOnly = false; // Always editable in this refactored version
  const isEditing = mode === 'edit';
  const isCreating = mode === 'create' || mode === 'createSub';
  const isEmpty = !selectedMenu && !isCreating;

  const title = isEmpty
    ? '메뉴 상세'
    : isCreating
      ? parentMenu
        ? `'${parentMenu.name}'의 하위 메뉴 추가`
        : '메뉴 추가'
      : `${selectedMenu.name}`;

  // Helper to prepare data for save (convert parentId 0 to null)
  const handleSaveClick = () => {
    const dataToSave = { ...formData };
    if (dataToSave.parentId === 0) {
      dataToSave.parentId = null;
    }
    onSave(dataToSave);
  };

  return (
    <>
      <Content.Body>
        {isEmpty ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
            메뉴를 선택하거나 '메뉴 추가'를 클릭하세요.
          </div>
        ) : (
          <>
            <div className={styles.conTitWrap}>
              <div className={styles.sectionTitle}>
                <h3>{title}</h3>
                <div className={styles.actionButtonContainer}>
                  {isEditing && (
                    <>
                      <Button variant="danger" onClick={() => onDelete(selectedMenu.menuId)}>
                        삭제
                      </Button>
                      <Button variant="primary" onClick={handleSaveClick}>
                        저장
                      </Button>
                    </>
                  )}
                  {isCreating && (
                    <>
                      <Button variant="primary" onClick={handleSaveClick}>
                        저장
                      </Button>
                      <Button variant="secondary" onClick={onCancel}>
                        취소
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className={`${styles.depthSection} ${styles.noBgBd} hasItem02`}>
              <Select
                label="상위 메뉴"
                options={parentOptions}
                value={formData.parentId !== undefined ? formData.parentId : 0}
                onChange={(value) => handleChange('parentId', value)}
                disabled={isReadOnly}
                className={styles.gridFull}
                required
              />
              <Input
                label="메뉴명"
                required
                value={formData.name || ''}
                onChange={(e) => handleChange('name', e.target.value)}
                disabled={isReadOnly}
                placeholder="메뉴명을 입력하세요"
              />
              <Input
                label="순서"
                required
                type="number"
                value={formData.order || 0}
                onChange={(e) => handleChange('order', e.target.value === '' ? 0 : parseInt(e.target.value))}
                disabled={isReadOnly}
              />
              <Input
                label="메뉴 URL"
                value={formData.menuUrl || ''}
                onChange={(e) => handleChange('menuUrl', e.target.value)}
                disabled={isReadOnly}
                placeholder="/url/path"
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Label htmlFor="menuIcon">메뉴 아이콘</Label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      border: '1px solid #e0e0e0',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#fff',
                      overflow: 'hidden',
                      flexShrink: 0
                    }}
                  >
                    {formData.menuIcon ? (
                      <img
                        src={formData.menuIcon}
                        alt="icon"
                        style={{ maxWidth: '24px', maxHeight: '24px', objectFit: 'contain' }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <span style={{ fontSize: '10px', color: '#ccc' }}>No</span>
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <Select
                      id="menuIcon"
                      name="menuIcon"
                      value={formData.menuIcon}
                      onChange={(val) => handleChange('menuIcon', val)}
                      options={iconOptions}
                      placeholder="아이콘 선택"
                    />
                  </div>
                </div>
              </div>
              <Select
                label="할당 권한"
                required
                options={[
                  { label: 'USER', value: 'USER' },
                  { label: 'ADM', value: 'ADM' },
                  { label: 'SYSADM', value: 'SYSADM' }
                ]}
                value={formData.assignRole || 'USER'}
                onChange={(value) => handleChange('assignRole', value)}
                disabled={isReadOnly}
              />

              <RadioGroup
                label="사용 여부"
                name="useYn"
                options={[
                  { label: '사용', value: 'Y' },
                  { label: '미사용', value: 'N' }
                ]}
                value={formData.useYn || 'Y'}
                onChange={(value) => handleChange('useYn', value)}
                className="itemCol1"
                disabled={isReadOnly}
                bordered
              />
            </div>
          </>
        )}
      </Content.Body>
    </>
  );
};

export default MenuDetail;
