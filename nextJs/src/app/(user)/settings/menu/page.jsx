'use client';

import React, { useEffect, useCallback, useState } from 'react';
import { api as MenuApi } from '@/features/admin-menu/script/api';
import MenuTree from '@/features/admin-menu/ui/MenuTree';
import MenuDetail from '@/features/admin-menu/ui/MenuDetail';
import adminStyles from '@/features/admin-menu/ui/AdminMenu.module.scss';
import { ContentLayout, Content, Button } from '@/shared/component';
import { useAlertStore } from '@/shared/store/alertStore';
import { useMenuStore } from '@/shared/store';

/**
 * 시스템 어드민 메뉴 관리 페이지
 * @path /settings/menu
 */
const AdminMenuPage = () => {
  const { showError, showSuccess, showConfirm } = useAlertStore();
  const {
    loadAdminTree,
    // 관리자 메뉴 트리 관리
    adminTreeData: treeData,
    adminExpandedKeys: expandedKeys,
    adminIsLoading: adminLoading,
    setAdminExpandedKeys,
    optimisticAdminTreeUpdate,
    rollbackAdminTree,
    clearAdminTreeStash
  } = useMenuStore();

  const [selectedKey, setSelectedKey] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isChanged, setIsChanged] = useState(false); // 폼에 저장되지 않은 변경사항 추적

  // mode: 'view' | 'edit' | 'create' | 'createSub'
  const [mode, setMode] = useState('view');

  // 확장 상태 변경 핸들러
  const handleExpandedChange = useCallback(
    (expandedKeys) => {
      setAdminExpandedKeys(expandedKeys);
    },
    [setAdminExpandedKeys]
  );

  const fetchTree = useCallback(async () => {
    // Zustand store의 loadAdminTree 사용
    await loadAdminTree(() => MenuApi.getFullTree());
  }, [loadAdminTree]);

  // 초기 로딩
  useEffect(() => {
    fetchTree();
  }, [fetchTree]);

  const proceedSelect = useCallback((key, node) => {
    setSelectedKey(key);
    setSelectedNode(node);
    setMode('edit');
    setIsChanged(false);
  }, []);

  const handleSelect = useCallback(
    (key, node) => {
      // 실제 저장되지 않은 변경사항이 있거나 새로 생성 중일 때만 확인
      if (isChanged || mode === 'create' || mode === 'createSub') {
        showConfirm({
          title: '확인',
          message: '작성 중인 내용이 있습니다. 다른 메뉴를 수정하시겠습니까?',
          onConfirm: () => proceedSelect(key, node)
        });
      } else {
        proceedSelect(key, node);
      }
    },
    [isChanged, mode, showConfirm, proceedSelect]
  );

  const handleCreateRoot = useCallback(() => {
    setSelectedKey(null);
    setSelectedNode(null);
    setMode('create');
  }, []);

  const handleChangeMode = useCallback((newMode) => {
    setMode(newMode);
  }, []);

  const findNode = useCallback((nodes, key) => {
    if (!nodes || !Array.isArray(nodes)) return null;
    for (const node of nodes) {
      if (String(node.menuId) === key) return node;
      if (node.children) {
        const found = findNode(node.children, key);
        if (found) return found;
      }
    }
    return null;
  }, []);

  const handleSave = useCallback(
    async (values) => {
      // 낙관적 업데이트 - API 호출 전에 UI 즉시 업데이트
      if (mode === 'create' || mode === 'createSub') {
        // 생성: 상위 메뉴에 새 메뉴 추가
        optimisticAdminTreeUpdate(values, 'create');
      } else if (mode === 'edit') {
        // 수정: 기존 메뉴 업데이트
        optimisticAdminTreeUpdate(values, 'update', selectedKey);
      }

      const handleApiSuccess = () => {
        // 낙관적 업데이트 스태시 정리
        clearAdminTreeStash();
        if (mode === 'create' || mode === 'createSub') {
          setMode('view');
          setSelectedKey(null);
          setSelectedNode(null);
        } else if (mode === 'edit' && selectedKey) {
          // 수정 모드일 경우 선택된 노드 업데이트
          // Zustand에서 최신 treeData 가져오기
          const latestTreeData = useMenuStore.getState().adminTreeData;
          const updatedNode = findNode(latestTreeData, selectedKey);
          if (updatedNode) {
            setSelectedNode(updatedNode);
            setIsChanged(false);
          }
        }
        // 메뉴 추가 후 트리 다시 로드
        fetchTree();
      };

      const handleApiError = (error) => {
        console.error('저장 실패:', error);
        // 낙관적 업데이트 롤백
        rollbackAdminTree();
        setMode('view');
        setSelectedKey(null);
        setSelectedNode(null);
        setIsChanged(false);
      };

      if (mode === 'create' || mode === 'createSub') {
        await MenuApi.create(
          values,
          // _onSuccess
          (result) => {
            showSuccess('메뉴가 생성되었습니다.');
            handleApiSuccess();
          },
          // _onError
          handleApiError
        );
      } else if (mode === 'edit') {
        await MenuApi.update(
          values,
          // _onSuccess
          (result) => {
            showSuccess('메뉴가 수정되었습니다.');
            handleApiSuccess();
          },
          // _onError
          handleApiError
        );
      }
    },
    [
      mode,
      selectedKey,
      showSuccess,
      optimisticAdminTreeUpdate,
      findNode,
      clearAdminTreeStash,
      fetchTree,
      rollbackAdminTree
    ]
  );

  const handleDelete = useCallback(
    (menuId) => {
      showConfirm({
        title: '삭제 확인',
        message: '정말 이 메뉴를 완전히 삭제하시겠습니까? 하위 메뉴가 있으면 삭제되지 않습니다.',
        variant: 'warning',
        onConfirm: async () => {
          // 낙관적 업데이트 - API 호출 전에 즉시 UI에서 삭제
          optimisticAdminTreeUpdate({}, 'delete', menuId);

          await MenuApi.delete(
            menuId,
            // _onSuccess
            async (result) => {
              showSuccess('메뉴가 삭제되었습니다.');
              clearAdminTreeStash(); // 성공 시 스태시 정리

              // 상태 초기화 (관리자 트리와 사용자 사이드바 모두 반영)
              setSelectedKey(null);
              setSelectedNode(null);
              setMode('view');
            },
            // _onError
            (error) => {
              console.error('메뉴 삭제 실패:', error);
              // 낙관적 업데이트 롤백
              rollbackAdminTree();
              setSelectedKey(null);
              setSelectedNode(null);
              setMode('view');
            }
          );
        }
      });
    },
    [showConfirm, showSuccess, optimisticAdminTreeUpdate, clearAdminTreeStash, rollbackAdminTree]
  );

  return (
    <ContentLayout>
      <ContentLayout.Header title="시스템 메뉴 관리" subtitle="전체 시스템 메뉴의 구조와 권한을 관리합니다.">
        <Button variant="secondary" onClick={fetchTree} title="새로고침">
          새로고침
        </Button>
        <Button variant="primary" onClick={handleCreateRoot}>
          메뉴 추가
        </Button>
      </ContentLayout.Header>

      <Content.Split>
        <Content.Left>
          <div style={{ position: 'relative', height: '100%' }}>
            {adminLoading && (
              <div className={adminStyles.loadingOverlay}>
                {treeData && treeData.length > 0 ? '업데이트 중...' : '로딩 중...'}
              </div>
            )}
            <MenuTree
              loading={adminLoading}
              treeData={treeData}
              selectedKeys={selectedKey ? [selectedKey] : []}
              expandedKeys={expandedKeys}
              onExpandedChange={handleExpandedChange}
              onSelect={handleSelect}
              onRefresh={fetchTree}
              onAddRoot={handleCreateRoot}
            />
          </div>
        </Content.Left>
        <Content.Right>
          <MenuDetail
            mode={mode}
            selectedMenu={mode === 'createSub' ? null : selectedNode}
            parentMenu={mode === 'createSub' ? selectedNode : null}
            treeData={treeData}
            onSave={handleSave}
            onDelete={handleDelete}
            onCancel={() => {
              setMode('view');
              // 최상위 생성 취소 시 일반 보기. 하위 생성 취소 시 부모 보기.
            }}
            onChangeMode={handleChangeMode}
            onDirtyChange={setIsChanged}
          />
        </Content.Right>
      </Content.Split>
    </ContentLayout>
  );
};

export default AdminMenuPage;
