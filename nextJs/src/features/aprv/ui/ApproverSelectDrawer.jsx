'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button, Drawer, Input, Label, Tree } from '@/shared/component';
import styles from './ApproverSelectDrawer.module.scss';

/**
 * 결재자 선택 Drawer 컴포넌트
 * 조직도 트리를 표시하고 결재자를 선택할 수 있는 Drawer
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Drawer 열림 상태
 * @param {Function} props.onClose - Drawer 닫기 핸들러
 * @param {Array} props.empSearchList - 조직도 원본 데이터 (DEPT + EMP 노드)
 * @param {Function} props.onConfirm - 결재자 선택 확인 핸들러 (approver) => void
 * @param {Function} props.onSearch - 검색 핸들러 (searchQuery) => void
 */
const ApproverSelectDrawer = ({ isOpen, onClose, empSearchList = [], onConfirm, onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKey, setSelectedKey] = useState(null);
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  /**
   * 트리의 모든 노드 key를 추출 (자동 펼침용)
   * @param {Array} nodes - 트리 노드 배열
   * @returns {Array} 모든 노드의 key 배열
   */
  const getAllNodeKeys = (nodes) => {
    const keys = [];
    const traverse = (nodeList) => {
      nodeList.forEach((node) => {
        if (node.nodeType === 'DEPT') {
          // 부서 노드만 expandedKeys에 추가 (직원 노드는 leaf라서 불필요)
          keys.push(node.key);
        }
        if (node.children && node.children.length > 0) {
          traverse(node.children);
        }
      });
    };
    traverse(nodes);
    return keys;
  };

  /**
   * 백엔드 조직도 쿼리 결과를 Tree 컴포넌트용 계층 구조로 변환
   * - 가변 depth 지원 (1단계~3단계, 소규모 회사도 지원)
   * - 계층적 key 패턴 ('1', '1-1', '1-1-1')
   *
   * @param {Array} nodes - AprvOrgTreeODT[] (nodeType, deptId, uppDeptId, usrId 등 포함)
   * @returns {Array} Tree 구조 데이터 (key, title, children)
   */
  const buildTreeData = (nodes) => {
    if (!nodes || nodes.length === 0) return [];

    // DEPT 노드와 EMP 노드 분리
    const deptNodes = nodes.filter((node) => node.nodeType === 'DEPT');
    const empNodes = nodes.filter((node) => node.nodeType === 'EMP');

    // 각 부서별 직원 그룹화
    const empByDept = new Map();
    empNodes.forEach((emp) => {
      if (!empByDept.has(emp.deptId)) {
        empByDept.set(emp.deptId, []);
      }
      empByDept.get(emp.deptId).push(emp);
    });

    /**
     * 재귀적으로 부서 트리 구성
     * @param {number|null} parentDeptId - 상위 부서 ID (null이면 최상위)
     * @param {string} parentKey - 상위 노드의 key (빈 문자열이면 최상위)
     * @returns {Array} children 배열
     */
    const buildChildren = (parentDeptId, parentKey) => {
      const children = [];
      let childIndex = 0;

      // 1. 하위 부서들 추가 (uppDeptId === parentDeptId)
      const subDepts = deptNodes.filter((dept) => dept.uppDeptId === parentDeptId);

      subDepts.forEach((dept) => {
        childIndex++;
        const deptKey = parentKey ? `${parentKey}-${childIndex}` : `${childIndex}`;

        // 재귀적으로 하위 부서의 children 구성
        const deptChildren = buildChildren(dept.deptId, deptKey);

        // 부서 노드 생성 (children이 있으면 부모 노드, 없으면 leaf 노드)
        const nodeData = {
          key: deptKey,
          title: dept.deptNm,
          nodeType: 'DEPT',
          deptId: dept.deptId,
          isLeaf: deptChildren.length === 0
        };

        if (deptChildren.length > 0) {
          nodeData.children = deptChildren;
        }

        children.push(nodeData);
      });

      // 2. 현재 부서의 직원들 추가
      // parentDeptId가 null인 경우도 포함 (소규모 회사의 최상위 직원 지원)
      if (empByDept.has(parentDeptId)) {
        const employees = empByDept.get(parentDeptId);

        employees.forEach((emp) => {
          childIndex++;
          const empKey = parentKey ? `${parentKey}-${childIndex}` : `${childIndex}`;

          children.push({
            key: empKey,
            title: `${emp.usrNm} (${emp.posNm})`,
            nodeType: 'EMP',
            usrId: emp.usrId,
            usrNm: emp.usrNm,
            deptId: emp.deptId,
            posNm: emp.posNm,
            isLeaf: true // 직원 노드는 항상 leaf
          });
        });
      }

      return children;
    };

    // 최상위 부서들 (uppDeptId가 null)부터 시작
    return buildChildren(null, '');
  };

  /**
   * Drawer가 열리면 자동으로 검색 실행
   */
  useEffect(() => {
    if (isOpen && empSearchList.length > 0) {
      setHasSearched(true);
    }
  }, [isOpen, empSearchList]);

  /**
   * 검색된 결재자 목록
   * Drawer가 열리거나 검색 실행 후에만 표시
   */
  const filteredApprovers = useMemo(() => {
    // 검색하지 않은 상태에서는 빈 배열 반환
    if (!hasSearched) {
      return [];
    }

    // 검색 실행 후에는 서버에서 받은 결과를 그대로 사용
    return empSearchList;
  }, [empSearchList, hasSearched]);

  // 트리 데이터 생성 (검색 시에도 트리 구조 유지)
  const treeData = useMemo(() => buildTreeData(filteredApprovers), [filteredApprovers]);

  // treeData가 변경될 때마다 초기 상태로 모든 노드를 펼침
  useEffect(() => {
    if (treeData.length > 0) {
      setExpandedKeys(getAllNodeKeys(treeData));
    }
  }, [treeData]);

  /**
   * 트리 노드에서 결재자 정보 찾기 (재귀 탐색)
   * @param {string} key - 찾을 노드의 key
   * @returns {Object|null} 결재자 정보 (nodeType === 'EMP'인 노드)
   */
  const findApproverFromTree = (key) => {
    const searchNode = (nodes) => {
      for (const node of nodes) {
        if (node.key === key) {
          return node;
        }
        if (node.children && node.children.length > 0) {
          const found = searchNode(node.children);
          if (found) return found;
        }
      }
      return null;
    };

    return searchNode(treeData);
  };

  /**
   * 검색 실행 핸들러
   */
  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchQuery);
    }
    setHasSearched(true);
  };

  /**
   * Tree 선택 변경 핸들러
   * 직원 노드(nodeType === 'EMP')만 선택 가능
   */
  const handleTreeSelect = (selectedKeysValue) => {
    // single mode이므로 첫 번째 key만 확인
    const key = selectedKeysValue[0];
    if (!key) {
      setSelectedKey(null);
      return;
    }

    // 선택된 key에 해당하는 노드가 직원인지 확인
    const node = findApproverFromTree(key);
    if (node && node.nodeType === 'EMP') {
      setSelectedKey(key);
    } else {
      setSelectedKey(null);
    }
  };

  /**
   * 결재자 선택 확인
   */
  const handleConfirm = () => {
    if (!selectedKey) {
      return;
    }

    const approver = findApproverFromTree(selectedKey);

    if (!approver || approver.nodeType !== 'EMP') {
      return;
    }

    // 상위 컴포넌트로 선택된 결재자 전달
    onConfirm(approver);

    // 상태 초기화
    handleClose();
  };

  /**
   * Drawer 닫기
   */
  const handleClose = () => {
    setSearchQuery('');
    setSelectedKey(null);
    setHasSearched(false);
    onClose();
  };

  return (
    <Drawer isOpen={isOpen} onClose={handleClose} title="결재자 선택">
      <div className={styles.container}>
        <Label htmlFor="approver-search">조직도를 조회합니다.</Label>
        <Input
          variant="search"
          id="approver-search"
          placeholder="이름을 검색해주세요"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onSearch={handleSearch}
          onClear={() => {
            setSearchQuery('');
          }}
        />
        <div className={styles.treeContainer}>
          {treeData.length > 0 ? (
            <Tree
              data={treeData}
              selectionMode={'single'}
              selectedKeys={selectedKey ? [selectedKey] : []}
              onSelectedChange={handleTreeSelect}
              expandedKeys={expandedKeys}
              onExpandedChange={setExpandedKeys}
            />
          ) : (
            <div className={styles.emptyMessage}>검색 결과가 없습니다.</div>
          )}
        </div>
        <div className={styles.buttonContainer}>
          <div className="buttonGroup">
            <Button variant="primary" onClick={handleConfirm} disabled={!selectedKey}>
              확인
            </Button>
            <Button onClick={handleClose}>취소</Button>
          </div>
        </div>
      </div>
    </Drawer>
  );
};

export default ApproverSelectDrawer;
