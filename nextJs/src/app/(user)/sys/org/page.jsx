/**
 * <pre>
 * path           : app/(user)/org
 * fileName       : OrganizationPage
 * author         : hmlee
 * date           : 25. 11. 10.
 * description    : 조직도 관리 페이지
 * ===========================================================
 * DATE              AUTHOR        NOTE
 * -----------------------------------------------------------
 * 25. 11. 10.        hmlee       최초 생성
 * </pre>
 */
'use client';

import React, { useState, useEffect, useMemo } from 'react';

import {
  OrganizationApi,
  Organization,
  OrganizationDetail,
  OrganizationMembers,
  OrganizationSearch
} from '@/features/org';

import { validateOrganizationForm } from '@/features/org/script/schema';
import { ContentLayout, Button, Tree, Tab, Content } from '@/shared/component';

import { useAlertStore } from '@/shared/store/alertStore';

const OrganizationPage = function () {
  const { showError, showConfirm, showSuccess } = useAlertStore();

  const [searchKeyword, setSearchKeyword] = useState('');
  const [loading, setLoading] = useState(true);
  const [treeData, setTreeData] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [editData, setEditData] = useState(null);
  const [members, setMembers] = useState([]);
  const [memberPagination, setMemberPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    pageSize: 10,
    totalCount: 0
  });
  const [activeTab, setActiveTab] = useState('detail');
  const [allDepth1List, setAllDepth1List] = useState([]);
  const [allDepth2List, setAllDepth2List] = useState([]);
  const [allDepth3List, setAllDepth3List] = useState([]);
  const [filteredDepth2List, setFilteredDepth2List] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [errors, setErrors] = useState({});

  // 선택된 조직 ID
  const selectedOrgId = useMemo(() => {
    return selectedKeys.length > 0 ? Number(selectedKeys[0]) : null;
  }, [selectedKeys]);

  // 조직 트리 로드
  const fetchTree = async function () {
    setLoading(true);

    const result = await OrganizationApi.getTree({
      searchKeyword: searchKeyword || undefined
    });

    if (result) {
      setTreeData(result);

      // 트리 열어놓기
      if (result.length > 0) {
        const allKeys = [];
        const collectKeys = (nodes) => {
          nodes.forEach((node) => {
            allKeys.push(node.key);
            if (node.children && node.children.length > 0) {
              collectKeys(node.children);
            }
          });
        };
        collectKeys(result);
        setExpandedKeys(allKeys);
      }
    } else {
      setTreeData([]);
    }

    setLoading(false);
  };

  // 전체 조직 목록 로드
  const fetchAllDepthLists = async function () {
    const result = await OrganizationApi.getTree({
      searchKeyword: undefined
    });

    if (result) {
      setAllDepth1List(OrganizationApi.getByDepth(result, 1));
      setAllDepth2List(OrganizationApi.getByDepth(result, 2));
      setAllDepth3List(OrganizationApi.getByDepth(result, 3));
    } else {
      setAllDepth1List([]);
      setAllDepth2List([]);
      setAllDepth3List([]);
    }
  };

  // 트리 평탄화 헬퍼 함수
  const flattenTreeNode = function (node) {
    let result = [node];
    if (node.children && node.children.length > 0) {
      node.children.forEach((child) => {
        result = result.concat(flattenTreeNode(child));
      });
    }
    return result;
  };

  const handleCreate = function () {
    setActiveTab('detail');
    setIsCreating(true);
    setSelectedKeys([]);
    setSelectedOrg(null);
    setErrors({});
    setEditData({
      id: null,
      deptNm: '',
      deptDepth: '1',
      uppDeptId: null,
      parent1DepthId: null,
      parent2DepthId: null,
      createdAt: '',
      updatedAt: ''
    });
  };

  const handleBulkMoveDept = async function (userIds, targetDeptId) {
    showConfirm({
      title: '부서 이동',
      message: `선택한 ${userIds.length}명의 조직원을 이동하시겠습니까?`,
      variant: 'confirm',
      confirmText: '이동',
      cancelText: '취소',
      onConfirm: async () => {
        try {
          const result = await OrganizationApi.bulkMoveDept({
            userIds,
            targetDeptId
          });

          if (result) {
            showSuccess('조직원이 이동되었습니다.');

            // 조직원 목록 새로고침
            if (selectedOrgId) {
              fetchMembers(selectedOrgId, memberPagination.currentPage);
            }
          }
        } catch (error) {
          showError({
            title: '이동 오류',
            message: '부서 이동에 실패했습니다.',
            variant: 'error'
          });
        }
      }
    });
  };

  const handleSaveNew = function () {
    showConfirm({
      title: '조직 등록',
      message: '조직을 등록하시겠습니까?',
      variant: 'confirm',
      confirmText: '등록',
      cancelText: '취소',
      onConfirm: () => confirmCreate()
    });
  };

  const confirmCreate = async function () {
    try {
      const newErrors = {};
      let uppDeptId = null;

      // Depth별 uppDeptId 설정 및 에러 체크
      if (editData.deptDepth === '1') {
        const topCompany = treeData.find((d) => d.deptDepth === '0' || d.uppDeptId === null);
        if (topCompany) {
          uppDeptId = topCompany.deptId;
        } else {
          showError({
            title: 'error',
            message: '상위 회사 정보를 찾을 수 없습니다.',
            variant: 'error'
          });
          return;
        }
      } else if (editData.deptDepth === '2') {
        uppDeptId = editData.parent1DepthId;
        if (!uppDeptId) {
          newErrors.parent1DepthId = '1Depth를 선택해주세요.';
        }
      } else if (editData.deptDepth === '3') {
        uppDeptId = editData.parent2DepthId;
        if (!editData.parent1DepthId) {
          newErrors.parent1DepthId = '1Depth를 선택해주세요.';
        }
        if (!uppDeptId) {
          newErrors.parent2DepthId = '2Depth를 선택해주세요.';
        }
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      // Zod 스키마 검증
      const validationResult = validateOrganizationForm({
        deptNm: editData.deptNm,
        uppDeptId: uppDeptId,
        deptOrd: editData.deptOrd || 0
      });

      if (!validationResult.success) {
        setErrors((prev) => ({ ...prev, ...validationResult.errors }));
        return;
      }

      const createPayload = {
        deptNm: editData.deptNm,
        uppDeptId: uppDeptId
      };

      const result = await OrganizationApi.create(createPayload);

      if (result) {
        showSuccess('조직이 등록되었습니다.');
        setIsCreating(false);
        setErrors({});
        await fetchTree();
        await fetchAllDepthLists();
      }
    } catch (error) {
      showError({
        title: '등록 오류',
        message: '등록에 실패했습니다.',
        variant: 'error'
      });
    }
  };

  const handleCancelCreate = function () {
    setIsCreating(false);
    setEditData(null);
    setErrors({});
  };

  // 부서 순서 바꾸기
  const handleOrderChange = async function (direction) {
    const flatTree = treeData.flatMap((node) => flattenTreeNode(node));

    const siblings = flatTree
      .filter((n) => n.uppDeptId === selectedOrg.uppDeptId)
      .sort((a, b) => a.deptOrd - b.deptOrd);

    const currentIndex = siblings.findIndex((s) => s.deptId === selectedOrg.id);

    if (direction === 'up' && currentIndex === 0) return;
    if (direction === 'down' && currentIndex === siblings.length - 1) return;

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    const orders = [
      { deptId: siblings[currentIndex].deptId, deptOrd: siblings[targetIndex].deptOrd },
      { deptId: siblings[targetIndex].deptId, deptOrd: siblings[currentIndex].deptOrd }
    ];

    const result = await OrganizationApi.updateOrder(orders);

    if (result) {
      await fetchTree();
    }
  };

  // 조직 상세 정보 로드
  const fetchOrgDetail = async function (deptId) {
    if (!deptId) return;

    const result = await OrganizationApi.get(deptId);
    if (result) {
      const org = Organization.fromApi(result);
      setSelectedOrg(org);

      let parent1DepthId = null;
      let parent2DepthId = null;

      if (org.deptDepth === '2') {
        parent1DepthId = org.uppDeptId;
      } else if (org.deptDepth === '3') {
        parent2DepthId = org.uppDeptId;

        if (org.uppDeptId) {
          const parent = await OrganizationApi.get(org.uppDeptId);
          if (parent) {
            parent1DepthId = parent.uppDeptId;
          }
        }
      }

      setEditData({
        id: org.id,
        deptNm: org.deptNm,
        deptDepth: org.deptDepth,
        uppDeptId: org.uppDeptId,
        parent1DepthId: parent1DepthId,
        parent2DepthId: parent2DepthId,
        createdAt: org.createdAt,
        updatedAt: org.updatedAt
      });

      if (parent1DepthId) {
        const filtered = allDepth2List.filter((d) => d.uppDeptId === parent1DepthId && d.deptId !== org.id);
        setFilteredDepth2List(filtered);
      } else {
        setFilteredDepth2List([]);
      }

      fetchMembers(deptId);
    }
  };

  // 조직원 목록 로드
  const fetchMembers = async function (deptId, page = 1) {
    const result = await OrganizationApi.getMembers(deptId, {
      page,
      size: 10
    });

    if (result) {
      setMembers(Organization.fromApiMemberList(result.list || result));

      if (result.pagination) {
        setMemberPagination(result.pagination);
      } else {
        setMemberPagination({
          currentPage: 1,
          totalPages: 1,
          pageSize: 10,
          totalCount: result.list ? result.list.length : result.length
        });
      }
    } else {
      setMembers([]);
      setMemberPagination({
        currentPage: 1,
        totalPages: 1,
        pageSize: 10,
        totalCount: 0
      });
    }
  };

  const handleSearch = function () {
    fetchTree();
  };

  const handleClearSearch = function () {
    setSearchKeyword('');
  };

  // 조직원 페이지 변경 핸들러
  const handleMemberPageChange = function (newPage) {
    if (selectedOrgId) {
      fetchMembers(selectedOrgId, newPage);
    }
  };

  const handleChange = function (field, value) {
    // 에러 초기화
    setErrors((prev) => ({ ...prev, [field]: undefined }));

    if (field === 'moveOrder') {
      handleOrderChange(value);
      return;
    }
    if (field === 'deptDepth') {
      let newParent1DepthId = null;
      let newParent2DepthId = null;

      setEditData((prev) => ({
        ...prev,
        [field]: value,
        parent1DepthId: newParent1DepthId,
        parent2DepthId: newParent2DepthId
      }));

      setFilteredDepth2List([]);
      return;
    }
    if (field === 'parent1DepthId') {
      // parent1DepthId 에러 초기화
      setErrors((prev) => ({ ...prev, parent1DepthId: undefined, parent2DepthId: undefined }));

      const filtered = allDepth2List.filter((d) => d.uppDeptId === value && d.deptId !== editData.id);
      setFilteredDepth2List(filtered);

      setEditData((prev) => ({
        ...prev,
        parent1DepthId: value,
        parent2DepthId: null
      }));
    } else if (field === 'parent2DepthId') {
      // parent2DepthId 에러 초기화
      setErrors((prev) => ({ ...prev, parent2DepthId: undefined }));

      setEditData((prev) => ({
        ...prev,
        [field]: value
      }));
    } else {
      setEditData((prev) => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleUpdate = function () {
    showConfirm({
      title: '조직 수정',
      message: '조직 정보를 수정하시겠습니까?',
      variant: 'confirm',
      onConfirm: () => confirmUpdate()
    });
  };

  const handleDelete = function () {
    const flatList = OrganizationApi.getByDepth(treeData, selectedOrg.deptDepth);
    const currentOrg = flatList.find((org) => org.deptId === selectedOrg.id);

    if (currentOrg && currentOrg.children && currentOrg.children.length > 0) {
      showError({
        title: '삭제 불가',
        message: '하위 부서가 존재하여 삭제할 수 없습니다.',
        variant: 'error'
      });
      return;
    }

    showConfirm({
      title: '조직 삭제',
      message: '이 조직을 삭제하시겠습니까?',
      variant: 'warning',
      confirmText: '삭제',
      cancelText: '취소',
      onConfirm: () => confirmDelete()
    });
  };

  const confirmUpdate = async function () {
    try {
      const newErrors = {};
      let uppDeptId = null;

      // Depth별 uppDeptId 설정 및 에러 체크
      if (editData.deptDepth === '1') {
        const topCompany = treeData.find((d) => d.deptDepth === '0' || d.uppDeptId === null);
        if (topCompany) {
          uppDeptId = topCompany.deptId;
        } else {
          showError({
            title: '수정 오류',
            message: '상위 회사 정보를 찾을 수 없습니다.',
            variant: 'error'
          });
          return;
        }
      } else if (editData.deptDepth === '2') {
        uppDeptId = editData.parent1DepthId;
        if (!uppDeptId) {
          newErrors.parent1DepthId = '1Depth를 선택해주세요.';
        }
      } else if (editData.deptDepth === '3') {
        uppDeptId = editData.parent2DepthId;
        if (!editData.parent1DepthId) {
          newErrors.parent1DepthId = '1Depth를 선택해주세요.';
        }
        if (!uppDeptId) {
          newErrors.parent2DepthId = '2Depth를 선택해주세요.';
        }
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      // Zod 스키마 검증
      const validationResult = validateOrganizationForm({
        deptNm: editData.deptNm,
        uppDeptId: uppDeptId
      });

      if (!validationResult.success) {
        setErrors((prev) => ({ ...prev, ...validationResult.errors }));
        return;
      }

      const updatePayload = {
        deptNm: editData.deptNm,
        deptDepth: editData.deptDepth,
        uppDeptId: uppDeptId
      };

      const result = await OrganizationApi.update(editData.id, updatePayload);

      if (result) {
        await fetchTree();
        await fetchAllDepthLists();
        await fetchOrgDetail(editData.id);
        setErrors({});
        showSuccess('조직 수정이 완료되었습니다.');
      }
    } catch (error) {
      showError({
        title: '수정 오류',
        message: '수정에 실패했습니다.',
        variant: 'error'
      });
    }
  };

  const confirmDelete = async function () {
    try {
      const success = await OrganizationApi.delete(selectedOrg.id);

      if (success) {
        showSuccess('조직이 삭제되었습니다.');
        setSelectedKeys([]);
        setSelectedOrg(null);
        setEditData(null);
        setMembers([]);
        setErrors({});
        await fetchTree();
        await fetchAllDepthLists();
      }
    } catch (error) {
      showError({
        title: '삭제 오류',
        message: '삭제에 실패했습니다.',
        variant: 'error'
      });
    }
  };

  // 초기 로드
  useEffect(function () {
    fetchTree();
    fetchAllDepthLists(); // 전체 depth 목록 로드
  }, []);

  // 검색어 클리어 시 재조회
  useEffect(
    function () {
      if (searchKeyword === '') {
        fetchTree();
      }
    },
    [searchKeyword]
  );

  // 선택된 조직 변경 시
  useEffect(
    function () {
      if (selectedOrgId && !isCreating) {
        fetchOrgDetail(selectedOrgId);
      } else if (selectedOrgId && isCreating) {
        setIsCreating(false);
        setErrors({});
        fetchOrgDetail(selectedOrgId);
      } else if (!selectedOrgId && !isCreating) {
        setSelectedOrg(null);
        setEditData(null);
        setMembers([]);
      }
    },
    [selectedOrgId, isCreating]
  );

  return (
    <ContentLayout>
      <ContentLayout.Header title="조직도 관리" subtitle="조직도를 설계하고 부서 이동을 관리합니다.">
        <Button variant="primary" onClick={handleCreate}>
          등록
        </Button>
      </ContentLayout.Header>
      <Content.Split>
        <Content.Left>
          <OrganizationSearch
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onSearch={handleSearch}
            onClear={handleClearSearch}
            placeholder="부서명으로 검색"
            disabled={loading}
          />

          {loading ? (
            <div>로딩 중...</div>
          ) : treeData.length === 0 ? (
            <div>조직이 없습니다.</div>
          ) : (
            <Tree
              data={treeData}
              selectable
              selectedKeys={selectedKeys}
              onSelectedChange={setSelectedKeys}
              expandedKeys={expandedKeys}
              onExpandedChange={setExpandedKeys}
            />
          )}
        </Content.Left>

        <Content.Right>
          <Tab
            tabs={[
              { label: '조직 상세 정보', value: 'detail' },
              { label: '조직원 정보', value: 'members' }
            ]}
            value={activeTab}
            onChange={(tab) => {
              if (isCreating && tab === 'members') {
                setIsCreating(false);
                setEditData(null);
                setErrors({});
              }
              setActiveTab(tab);
            }}
          />

          {activeTab === 'detail' && (
            <OrganizationDetail
              organization={editData}
              depth1List={allDepth1List}
              depth2List={allDepth2List}
              filteredDepth2List={filteredDepth2List}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
              onChange={handleChange}
              isCreating={isCreating}
              onSaveNew={handleSaveNew}
              onCancelCreate={handleCancelCreate}
              errors={errors}
            />
          )}

          {activeTab === 'members' && (
            <OrganizationMembers
              organization={selectedOrg}
              members={members}
              pagination={memberPagination}
              onPageChange={handleMemberPageChange}
              onBulkMoveDept={handleBulkMoveDept}
              depth1List={allDepth1List}
              depth2List={allDepth2List}
              depth3List={allDepth3List}
              loading={loading}
            />
          )}
        </Content.Right>
      </Content.Split>
    </ContentLayout>
  );
};

export default OrganizationPage;
