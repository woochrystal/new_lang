'use client';
import { useState } from 'react';
import RcTree from 'rc-tree';
import 'rc-tree/assets/index.css';
import styles from './tree.module.scss';

/**
 * Tree 컴포넌트 - rc-tree 기반 트리 뷰 컴포넌트
 *
 * @param {Object} props
 * @param {Array} props.data - 트리 데이터 배열 (key, title, children 구조)
 * @param {string} [props.selectionMode='single'] - 선택 모드
 *   - 'checkbox': 체크박스로 복수 선택
 *   - 'single': 클릭으로 단일 선택 (기본값)
 * @param {boolean} [props.checkable] - (deprecated) selectionMode 사용 권장. 체크박스 표시 여부
 * @param {string[]} [props.checkedKeys] - 체크된 노드 키 배열 (controlled, selectionMode='checkbox'일 때 사용)
 * @param {Function} [props.onCheckedChange] - 체크 변경 콜백 (checkedKeys) => void
 * @param {string[]} [props.expandedKeys] - 확장된 노드 키 배열 (controlled)
 * @param {Function} [props.onExpandedChange] - 확장 변경 콜백 (expandedKeys) => void
 * @param {string[]} [props.selectedKeys] - 선택된 노드 키 배열 (controlled, selectionMode='single'일 때 사용)
 * @param {Function} [props.onSelectedChange] - 선택 변경 콜백 (selectedKeys) => void
 * @param {boolean} [props.defaultExpandAll=false] - 기본 전체 확장 여부
 * @param {string} [props.className] - 추가 CSS 클래스
 *
 * @example
 * // 단일 선택 모드 (기본)
 * const [selectedKeys, setSelectedKeys] = useState([]);
 * <Tree
 *   data={treeData}
 *   selectionMode="single"
 *   selectedKeys={selectedKeys}
 *   onSelectedChange={setSelectedKeys}
 * />
 *
 * @example
 * // 체크박스 복수 선택 모드
 * const [checkedKeys, setCheckedKeys] = useState([]);
 * <Tree
 *   data={treeData}
 *   selectionMode="checkbox"
 *   checkedKeys={checkedKeys}
 *   onCheckedChange={setCheckedKeys}
 * />
 */
export const Tree = ({
  data = [],
  selectionMode = 'single',
  disableFolderCheckbox = true,
  checkable, // deprecated, for backward compatibility
  checkedKeys,
  onCheckedChange,
  expandedKeys,
  onExpandedChange,
  selectedKeys,
  onSelectedChange,
  defaultExpandAll = false,
  className = '',
  ...rest
}) => {
  // selectionMode 결정 (하위 호환성을 위해 checkable prop 체크)
  const isCheckboxMode = selectionMode === 'checkbox' || checkable === true;

  /*
  // 폴더(부모 노드)의 체크박스를 비활성화하는 헬퍼 함수
  const processTreeData = (nodes) => {
    return nodes.map((node) => ({
      ...node,
      // children이 있으면 체크박스 비활성화 (폴더는 체크박스 없음)
      disableCheckbox: Array.isArray(node.children) && node.children.length > 0,
      children: node.children ? processTreeData(node.children) : undefined
    }));
  };
  */

  // 폴더(부모 노드)의 체크박스를 활성 또는 비활성화하는 헬퍼 함수 + 최상단 노드 표시
  const processTreeData = (nodes, depth = 0) => {
    return nodes.map((node) => {
      const isFolder = Array.isArray(node.children) && node.children.length > 0;
      const processedNode = {
        ...node,
        // disableFolderCheckbox(기본값 true) 이고 isFolder일 경우 : children이 있으면 폴더는 체크박스 없음
        disableCheckbox: disableFolderCheckbox && isFolder,
        // 최상단 노드 여부 표시
        depth,
        // 자식 노드는 재귀 처리
        children: node.children ? processTreeData(node.children, depth + 1) : undefined
      };
      return processedNode;
    });
  };

  // uncontrolled 상태 관리
  const [internalCheckedKeys, setInternalCheckedKeys] = useState([]);
  const [internalExpandedKeys, setInternalExpandedKeys] = useState([]);
  const [internalSelectedKeys, setInternalSelectedKeys] = useState([]);

  // controlled vs uncontrolled 분기
  const isCheckedControlled = checkedKeys !== undefined;
  const isExpandedControlled = expandedKeys !== undefined;
  const isSelectedControlled = selectedKeys !== undefined;

  const currentCheckedKeys = isCheckedControlled ? checkedKeys : internalCheckedKeys;
  const currentExpandedKeys = isExpandedControlled ? expandedKeys : internalExpandedKeys;
  const currentSelectedKeys = isSelectedControlled ? selectedKeys : internalSelectedKeys;

  // rc-tree의 onCheck는 (checkedKeys, info) 형태로 호출됨
  const handleCheck = (checkedKeysValue) => {
    // checkedKeysValue는 배열 또는 {checked: [], halfChecked: []} 객체일 수 있음
    const keys = Array.isArray(checkedKeysValue) ? checkedKeysValue : checkedKeysValue.checked;

    if (!isCheckedControlled) {
      setInternalCheckedKeys(keys);
    }

    if (onCheckedChange) {
      onCheckedChange(keys);
    }
  };

  // rc-tree의 onExpand는 (expandedKeys, info) 형태로 호출됨
  const handleExpand = (expandedKeysValue) => {
    if (!isExpandedControlled) {
      setInternalExpandedKeys(expandedKeysValue);
    }

    if (onExpandedChange) {
      onExpandedChange(expandedKeysValue);
    }
  };

  // rc-tree의 onSelect는 (selectedKeys, info) 형태로 호출됨
  const handleSelect = (selectedKeysValue) => {
    if (!isSelectedControlled) {
      setInternalSelectedKeys(selectedKeysValue);
    }

    if (onSelectedChange) {
      onSelectedChange(selectedKeysValue);
    }
  };

  const treeClassName = [styles.tree, isCheckboxMode ? styles.checkboxMode : styles.singleMode, className]
    .filter(Boolean)
    .join(' ');

  // 체크박스가 활성화된 경우에만 데이터 처리 (폴더 체크박스 비활성화 + 최상단 표시)
  // const processedData = isCheckboxMode ? processTreeData(data) : data;
  const processedData = processTreeData(data);

  return (
    <div className={treeClassName}>
      <RcTree
        treeData={processedData}
        // selectionMode에 따른 선택 방식 설정
        checkable={isCheckboxMode}
        selectable={!isCheckboxMode}
        multiple={isCheckboxMode}
        // 상태 관리
        checkedKeys={currentCheckedKeys}
        onCheck={handleCheck}
        expandedKeys={currentExpandedKeys}
        onExpand={handleExpand}
        selectedKeys={currentSelectedKeys}
        onSelect={handleSelect}
        // 기타 설정
        defaultExpandAll={defaultExpandAll}
        showIcon={false}
        switcherIcon={() => null}
        titleRender={(nodeData) => {
          let nodeClass = '';

          if (nodeData.depth == 0) {
            nodeClass = 'depth0Tree'; // 최상단 폴더
          } else if (nodeData.depth == 1) {
            nodeClass = 'depth1Tree'; // 하위 폴더
          } else {
            nodeClass = 'depth2Tree';
          }

          return <span className={nodeClass}>{nodeData.title}</span>;
        }}
        {...rest}
      />
    </div>
  );
};

export default Tree;
