/**
 * <pre>
 * path           : app/(user)/role
 * fileName       : RolePage
 * author         : hmlee
 * date           : 25. 11. 17.
 * description    : 메뉴권한관리 페이지
 * ===========================================================
 * DATE              AUTHOR        NOTE
 * -----------------------------------------------------------
 * 25. 11. 17.        hmlee       최초 생성
 * </pre>
 */
'use client';

import React, { useState, useEffect } from 'react';

import { RoleApi, RoleDetail, RoleForm, RoleMenuTree, Role } from '@/features/role';
import { validateRoleForm } from '@/features/role/script/schema';

import { ContentLayout, Button, Tab, Content, Label } from '@/shared/component';
import { useAlertStore } from '@/shared/store/alertStore';
import styles from '@/shared/component/layout/layout.module.scss';
import uploadBoxStyles from '@/shared/ui/uploadBox/uploadBox.module.scss';

const RolePage = function () {
  const { showError, showConfirm, showSuccess } = useAlertStore();

  const [searchKeyword, setSearchKeyword] = useState('');
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState([]);
  const [selectedRoleId, setSelectedRoleId] = useState(null);
  const [allMenusList, setAllMenusList] = useState([]);
  const [treeData, setTreeData] = useState([]);
  const [dashboardMenuId, setDashboardMenuId] = useState(null);
  const [checkedKeys, setCheckedKeys] = useState([]);
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [activeTab, setActiveTab] = useState('menus');
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ authNm: '', authDesc: '' });

  // 전체 메뉴 트리 표시
  function showAllMenuTree() {
    const fullTree = buildMenuTree(allMenusList, dashboardMenuId);
    setTreeData(fullTree);

    // 모든 노드의 key 열기
    const allKeys = [];
    const collectKeys = (nodes) => {
      nodes.forEach((node) => {
        allKeys.push(node.key);
        if (node.children && node.children.length > 0) {
          collectKeys(node.children);
        }
      });
    };
    collectKeys(fullTree);
    setExpandedKeys(allKeys);
  }

  const fetchRoles = async function () {
    setLoading(true);

    const result = await RoleApi.getList();

    if (result) {
      setRoles(Role.fromApiList(result));
    } else {
      setRoles([]);
    }

    setLoading(false);
  };

  // 전체 메뉴 목록 조회 (초기 로드)
  const fetchAllMenus = async function () {
    const result = await RoleApi.getAllMenusForAdm();
    const dashboardId = await RoleApi.getDashboardId();

    if (result) {
      const menus = Role.fromApiMenuList(result);
      setAllMenusList(menus);

      if (dashboardId) {
        setDashboardMenuId(String(dashboardId));
      }

      const tree = buildMenuTree(menus, dashboardId);
      setTreeData(tree);

      const allKeys = [];
      const collectKeys = (nodes) => {
        nodes.forEach((node) => {
          allKeys.push(node.key);
          if (node.children && node.children.length > 0) {
            collectKeys(node.children);
          }
        });
      };
      collectKeys(tree);
      setExpandedKeys(allKeys);
    }
  };

  // 특정 권한의 메뉴 목록 조회 (체크 상태 업데이트용)
  const fetchRoleMenus = async function (authId) {
    const result = await RoleApi.getMenus(authId);

    let menuIds = [];
    if (result) {
      const roleMenus = Role.fromApiMenuList(result);
      menuIds = roleMenus.map((menu) => String(menu.menuId));
    }

    // 대시보드 ID가 없으면 자동 추가
    if (dashboardMenuId && !menuIds.includes(dashboardMenuId)) {
      menuIds.push(dashboardMenuId);
    }

    // treeData에 실제로 존재하는 키만 필터링
    const keysInTree = new Set();
    const collectKeys = (nodes) => {
      nodes.forEach((node) => {
        keysInTree.add(node.key);
        if (node.children) {
          collectKeys(node.children);
        }
      });
    };
    collectKeys(treeData);

    const validMenuIds = menuIds.filter((key) => keysInTree.has(key));

    // 리프 노드(자식이 없는 메뉴)만 체크 상태로 설정
    const leafNodeKeys = validMenuIds.filter((key) => {
      const menu = allMenusList.find((m) => String(m.menuId) === key);
      const hasChildren = allMenusList.some((m) => m.uppMenuId === menu?.menuId);
      return !hasChildren;
    });

    setCheckedKeys(leafNodeKeys);
  };

  const buildMenuTree = function (flatList, dashboardId = null) {
    const map = {};
    const tree = [];
    const dashboardKey = dashboardId ? String(dashboardId) : null;

    flatList.forEach((item) => {
      map[item.menuId] = {
        key: String(item.menuId),
        title: item.menuNm,
        menuId: item.menuId,
        menuDepth: item.menuDepth,
        menuOrd: item.menuOrd,
        uppMenuId: item.uppMenuId,
        disabled: String(item.menuId) === dashboardKey, // 대시보드만 disabled
        children: []
      };
    });

    flatList.forEach((item) => {
      if (item.uppMenuId && map[item.uppMenuId]) {
        map[item.uppMenuId].children.push(map[item.menuId]);
      } else {
        tree.push(map[item.menuId]);
      }
    });

    const sortByOrder = (nodes) => {
      nodes.sort((a, b) => a.menuOrd - b.menuOrd);
      nodes.forEach((node) => {
        if (node.children.length > 0) {
          sortByOrder(node.children);
        }
      });
    };
    sortByOrder(tree);

    return tree;
  };

  const handleRoleClick = function (authId) {
    setSelectedRoleId(authId);
    setIsCreating(false);
    setIsEditing(false);

    // 선택된 권한의 데이터를 editData에 설정
    const selectedRole = roles.find((role) => role.authId === authId);
    if (selectedRole) {
      setEditData({
        authNm: selectedRole.authNm,
        authDesc: selectedRole.authDesc
      });
    }
    fetchRoleMenus(authId);
  };

  const handleCreate = function () {
    setIsCreating(true);
    setIsEditing(false);
    setSelectedRoleId(null);
    setCheckedKeys(dashboardMenuId ? [dashboardMenuId] : []); // 대시보드 자동 선택
    setEditData({ authNm: '', authDesc: '' });
  };

  const handleEdit = function () {
    if (!selectedRoleId) return;
    setIsEditing(true);
    setIsCreating(false);
  };

  const handleSaveNew = function () {
    // Zod 스키마 검증
    const validationResult = validateRoleForm({
      authNm: editData.authNm,
      authDesc: editData.authDesc || ''
    });

    if (!validationResult.success) {
      const firstError = Object.values(validationResult.errors)[0];
      showError({
        title: '입력 오류',
        message: firstError,
        variant: 'error'
      });
      return;
    }

    showConfirm({
      title: '권한 등록',
      message: '권한을 등록하시겠습니까?',
      variant: 'confirm',
      confirmText: '등록',
      cancelText: '취소',
      onConfirm: () => confirmCreate()
    });
  };

  const handleSaveEdit = function () {
    if (!selectedRoleId) return;

    // Zod 스키마 검증
    const validationResult = validateRoleForm({
      authNm: editData.authNm,
      authDesc: editData.authDesc || ''
    });

    if (!validationResult.success) {
      const firstError = Object.values(validationResult.errors)[0];
      showError({
        title: '입력 오류',
        message: firstError,
        variant: 'error'
      });
      return;
    }

    showConfirm({
      title: '권한 수정',
      message: '권한 정보를 수정하시겠습니까?',
      variant: 'confirm',
      confirmText: '수정',
      cancelText: '취소',
      onConfirm: () => confirmEdit()
    });
  };

  const confirmEdit = async function () {
    try {
      const authId = selectedRoleId;

      const updateRolePayload = {
        authNm: editData.authNm,
        authDesc: editData.authDesc || ''
      };

      const success = await RoleApi.update(authId, updateRolePayload);
      if (success) {
        showSuccess('권한이 수정되었습니다.');
        setIsEditing(false);
        await fetchRoles();
      } else {
        showError({
          title: '수정 오류',
          message: '권한 정보 수정에 실패했습니다. (응답 없음)',
          variant: 'error'
        });
      }
    } catch (error) {
      showError({
        title: '수정 오류',
        message: '수정에 실패했습니다.',
        variant: 'error'
      });
    }
  };

  const confirmCreate = async function () {
    try {
      const menuIds = getMenuIdsWithParents(checkedKeys);

      const createPayload = {
        authNm: editData.authNm,
        authDesc: editData.authDesc || '',
        menuIds: menuIds
      };

      const authId = await RoleApi.create(createPayload);

      if (authId) {
        showSuccess('권한이 등록되었습니다.');
        setIsCreating(false);
        setEditData({ authNm: '', authDesc: '' });
        setCheckedKeys([]);
        await fetchRoles();
      }
    } catch (error) {
      showError({
        title: '등록 오류',
        message: '등록에 실패했습니다.',
        variant: 'error'
      });
    }
  };

  // 선택된 메뉴의 모든 상위 메뉴 ID를 포함
  const getMenuIdsWithParents = function (selectedKeys) {
    const resultSet = new Set(selectedKeys.map(Number));

    selectedKeys.forEach((key) => {
      const menuId = Number(key);
      let currentMenu = allMenusList.find((m) => m.menuId === menuId);

      while (currentMenu && currentMenu.uppMenuId && currentMenu.uppMenuId !== 0) {
        resultSet.add(currentMenu.uppMenuId);
        currentMenu = allMenusList.find((m) => m.menuId === currentMenu.uppMenuId);
      }
    });

    return Array.from(resultSet);
  };

  const handleDelete = function () {
    if (!selectedRoleId) {
      showError({
        title: '선택 오류',
        message: '삭제할 권한을 선택해주세요.',
        variant: 'error'
      });
      return;
    }

    showConfirm({
      title: '권한 삭제',
      message: '이 권한을 삭제하시겠습니까?',
      variant: 'warning',
      confirmText: '삭제',
      cancelText: '취소',
      onConfirm: () => confirmDelete()
    });
  };

  const confirmDelete = async function () {
    const result = await RoleApi.delete(selectedRoleId);

    if (result?.success === true) {
      showSuccess('권한이 삭제되었습니다.');
      setSelectedRoleId(null);
      setEditData({ authNm: '', authDesc: '' });
      await fetchRoles();
      setCheckedKeys([]);
    } else {
      showError({
        title: '삭제 오류',
        message: result?.error?.message || '삭제에 실패했습니다.',
        variant: 'error'
      });
    }
  };

  const handleSaveMenus = function () {
    if (!selectedRoleId) {
      showError({
        title: '선택 오류',
        message: '권한을 선택해주세요.',
        variant: 'error'
      });
      return;
    }

    showConfirm({
      title: '메뉴 수정',
      message: '등록된 메뉴를 수정하시겠습니까?',
      variant: 'confirm',
      confirmText: '수정',
      cancelText: '취소',
      onConfirm: () => confirmSaveMenus()
    });
  };

  const confirmSaveMenus = async function () {
    try {
      const menuIds = getMenuIdsWithParents(checkedKeys);
      const success = await RoleApi.updateMenus(selectedRoleId, menuIds);
      if (success) {
        showSuccess('메뉴가 수정되었습니다.');
      } else {
        showError({
          title: '수정 오류',
          message: '메뉴 수정에 실패했습니다. (응답 없음)',
          variant: 'error'
        });
      }
    } catch (error) {
      showError({
        title: '수정 오류',
        message: '메뉴 수정에 실패했습니다.',
        variant: 'error'
      });
    }
  };

  const handleResetMenus = function () {
    if (!selectedRoleId) {
      showError({
        title: '선택 오류',
        message: '권한을 선택해주세요.',
        variant: 'error'
      });
      return;
    }

    showConfirm({
      title: '메뉴 초기화',
      message: '등록된 메뉴를 초기화하시겠습니까?',
      variant: 'warning',
      confirmText: '초기화',
      cancelText: '취소',
      onConfirm: () => confirmResetMenus()
    });
  };

  const confirmResetMenus = async function () {
    try {
      const success = await RoleApi.updateMenus(selectedRoleId, []);
      if (success) {
        setCheckedKeys([]);
        showSuccess('메뉴가 초기화되었습니다.');
      } else {
        showError({
          title: '초기화 오류',
          message: '메뉴 초기화에 실패했습니다. (응답 없음)',
          variant: 'error'
        });
      }
    } catch (error) {
      showError({
        title: '초기화 오류',
        message: '메뉴 초기화에 실패했습니다.',
        variant: 'error'
      });
    }
  };

  const handleChange = function (field, value) {
    setEditData({ ...editData, [field]: value });
  };

  const handleSearch = function () {
    const keyword = searchKeyword.trim().toLowerCase();

    if (!keyword) {
      showAllMenuTree(); // 검색어가 없으면 전체 메뉴 트리 표시
      return;
    }

    // 1. 검색어 포함 메뉴 필터링 (원본 리스트 사용)
    const filteredMenus = allMenusList.filter((menu) => menu.menuNm.toLowerCase().includes(keyword));

    // 2. 필터링된 메뉴와 그 상위 부모 노드들 찾기
    const nodesToShow = new Set();

    // 재귀적으로 부모 노드를 포함하여 보여줄 노드 집합 구성
    const collectParents = (menuId) => {
      const menu = allMenusList.find((m) => m.menuId === menuId);
      if (menu) {
        nodesToShow.add(menu);
        if (menu.uppMenuId && menu.uppMenuId !== 0) {
          // 최상위 메뉴가 아니면
          collectParents(menu.uppMenuId);
        }
      }
    };

    filteredMenus.forEach((menu) => collectParents(menu.menuId));

    // 3. 새로운 트리 구조 구축 (노드ToShow만 포함)
    const filteredTree = buildMenuTree(Array.from(nodesToShow), dashboardMenuId);
    setTreeData(filteredTree);

    // 4. 검색된 항목의 부모 노드까지 확장 상태로 설정
    const keysToExpand = Array.from(nodesToShow).map((node) => String(node.menuId));
    setExpandedKeys(keysToExpand);

    // 5. checkedKeys 필터링
    const keysInFilteredTree = new Set(keysToExpand); // nodesToShow의 key(string) 집합

    const newCheckedKeys = checkedKeys.filter((key) => keysInFilteredTree.has(key));

    // 필터링된 트리에서 존재하지 않는 키를 checkedKeys에서 제거
    setCheckedKeys(newCheckedKeys);
  };

  const handleClearSearch = function () {
    setSearchKeyword('');
    showAllMenuTree(); // 검색 초기화 시 전체 트리를 다시 로드
  };

  useEffect(function () {
    fetchRoles();
    fetchAllMenus();
  }, []);

  return (
    <ContentLayout>
      <ContentLayout.Header title="메뉴 권한 관리" subtitle="메뉴별 권한을 변경 및 관리할 수 있습니다.">
        {!isCreating && !isEditing && (
          <Button variant="primary" onClick={handleCreate}>
            등록
          </Button>
        )}
      </ContentLayout.Header>

      <Content.Split>
        <Content.Left>
          <div className={`${styles.titleSection} ${styles.titleWithButtonSection}`}>
            <div className={styles.sectionTitle}>
              <h3>권한을 선택합니다.</h3>
              <div className={styles.actionButtonContainer}>
                {selectedRoleId && !isCreating && !isEditing && (
                  <Button variant="secondary" onClick={handleEdit}>
                    수정
                  </Button>
                )}
                {(isCreating || isEditing) && (
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setIsCreating(false);
                      setIsEditing(false);
                      // 취소 시 기존 선택된 권한으로 돌아가면서 데이터 복원
                      if (selectedRoleId) {
                        const originalRole = roles.find((role) => role.authId === selectedRoleId);
                        if (originalRole) {
                          setEditData({ authNm: originalRole.authNm, authDesc: originalRole.authDesc });
                          fetchRoleMenus(selectedRoleId); // 기존 메뉴 체크 상태 복원
                        }
                      } else {
                        setEditData({ authNm: '', authDesc: '' });
                      }
                    }}
                  >
                    취소
                  </Button>
                )}
                {selectedRoleId && !isCreating && !isEditing && (
                  <Button variant="danger" onClick={handleDelete}>
                    삭제
                  </Button>
                )}
              </div>
            </div>
            <Label required>필수 입력 정보입니다.</Label>
          </div>

          <div className={`${uploadBoxStyles.controlBoxWrap}`}>
            {loading ? (
              <div>로딩 중...</div>
            ) : roles.length === 0 ? (
              <div>불러온 권한이 없습니다.</div>
            ) : !isCreating && !isEditing ? (
              <>
                {roles.map((role) => (
                  <RoleDetail
                    key={role.authId}
                    role={role}
                    isSelected={selectedRoleId === role.authId}
                    onClick={handleRoleClick}
                  />
                ))}
              </>
            ) : null}

            {(isCreating || isEditing) && (
              <RoleForm
                formData={editData}
                onChange={handleChange}
                onSave={isCreating ? handleSaveNew : handleSaveEdit}
                isEditing={isEditing}
              />
            )}
          </div>
        </Content.Left>

        {/* 흰 배경 안들어가면 className={styles.roundedLgWrapNobg} 추가 */}
        <Content.Right className={styles.roundedLgWrapNobg}>
          <Tab tabs={[{ label: '메뉴 등록', value: 'menus' }]} value={activeTab} onChange={setActiveTab} />
          <RoleMenuTree
            searchKeyword={searchKeyword}
            onSearchChange={(e) => setSearchKeyword(e.target.value)}
            onSearch={handleSearch}
            onSave={handleSaveMenus}
            onReset={handleResetMenus}
            onClearSearch={handleClearSearch}
            treeData={treeData}
            checkedKeys={checkedKeys}
            onCheckedChange={setCheckedKeys}
            expandedKeys={expandedKeys}
            onExpandedChange={setExpandedKeys}
            loading={loading}
            selectedRoleId={selectedRoleId}
            isCreating={isCreating}
            isEditing={isEditing}
            hideActions={isCreating}
          />
        </Content.Right>
      </Content.Split>
    </ContentLayout>
  );
};

export default RolePage;
