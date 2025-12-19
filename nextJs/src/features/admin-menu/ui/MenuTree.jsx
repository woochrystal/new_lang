import React from 'react';
import { Tree } from '@/shared/component';
import styles from '@/shared/component/layout/layout.module.scss';
import adminStyles from './AdminMenu.module.scss';

const MenuTree = ({ treeData, selectedKeys, onSelect, loading, expandedKeys, onExpandedChange }) => {
  const handleTreeSelect = (selectedKeys, { node }) => {
    // 순환 참조가 있을 수 있는 내부 RcTree 노드 인스턴스가 아닌 깨끗한 데이터 객체를 전달하도록 보장
    if (selectedKeys && selectedKeys.length > 0) {
      // 필요한 속성으로 깨끗한 객체 생성
      // 필요한 속성을 명시적으로 복사
      const cleanNode = {
        menuId: node.menuId,
        name: node.name,
        menuUrl: node.menuUrl,
        menuIcon: node.menuIcon,
        sortOrder: node.sortOrder,
        order: node.order,
        assignRole: node.assignRole,
        useYn: node.useYn,
        parentId: node.parentId,
        children: node.children, // Reference to children array is needed
        depth: node.depth,
        key: node.key
      };
      onSelect(selectedKeys[0], cleanNode);
    }
  };

  // API 데이터를 Tree 컴포넌트 형식으로 변환 (name -> title)
  const processedTreeData = React.useMemo(() => {
    if (!treeData) return [];

    // 노드를 전달할 때 내부 RcTree 속성을 확장하지 않도록 명시적 속성 매핑 활용
    const mapNode = (node) => ({
      key: String(node.menuId), // Ensure key is string
      title: node.name, // Map name to title for Tree component
      children: node.children ? node.children.map(mapNode) : undefined,

      // Carry over needed data
      menuId: node.menuId,
      name: node.name,
      menuUrl: node.menuUrl,
      menuIcon: node.menuIcon,
      sortOrder: node.sortOrder,
      order: node.order,
      assignRole: node.assignRole,
      useYn: node.useYn,
      parentId: node.parentId,
      depth: node.depth
    });

    // treeData가 ID 0 (가상 루트) 객체인 경우 자식들을 매핑하여 반환 (ROOT 언래핑)
    let rawNodes;
    if (Array.isArray(treeData)) {
      if (treeData.length === 1 && treeData[0].menuId === 0 && treeData[0].children) {
        rawNodes = treeData[0].children;
      } else {
        rawNodes = treeData;
      }
    } else if (treeData.menuId === 0 && treeData.children) {
      rawNodes = treeData.children;
    } else {
      rawNodes = [treeData];
    }

    // Dedup by menuId
    const seen = new Set();
    const uniqueNodes = [];
    rawNodes.forEach((node) => {
      const key = String(node.menuId);
      if (!seen.has(key)) {
        seen.add(key);
        uniqueNodes.push(node);
      }
    });

    return uniqueNodes.map(mapNode);
  }, [treeData]);

  // The shared Tree component might expect 'data' prop instead of 'treeData'
  // Based on RoleMenuTree: <Tree data={treeData} ... />

  return (
    <>
      <div
        className={`${styles.depthSection} ${styles.noBgBd} ${adminStyles.treeContainer}`}
        style={{ position: 'relative' }}
      >
        {loading && (
          <div
            className={
              processedTreeData && processedTreeData.length > 0 ? adminStyles.loadingOverlay : adminStyles.loading
            }
          >
            {processedTreeData && processedTreeData.length > 0 ? '업데이트 중...' : '로딩 중...'}
          </div>
        )}

        {!processedTreeData || processedTreeData.length === 0 ? (
          !loading && <div className={adminStyles.empty}>등록된 메뉴가 없습니다.</div>
        ) : (
          <Tree
            data={processedTreeData}
            selectedKeys={selectedKeys}
            expandedKeys={expandedKeys}
            onExpandedChange={onExpandedChange}
            onSelect={handleTreeSelect}
            // showIcon={true} // Check if supported
          />
        )}
      </div>
    </>
  );
};

export default MenuTree;
