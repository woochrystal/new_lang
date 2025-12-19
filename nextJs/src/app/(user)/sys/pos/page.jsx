/**
 * <pre>
 * path           : app/(user)/pos
 * fileName       : PositionPage
 * author         : hmlee
 * date           : 25. 11. 10.
 * description    : 직급 관리 페이지
 * ===========================================================
 * DATE              AUTHOR        NOTE
 * -----------------------------------------------------------
 * 25. 11. 10.        hmlee       최초 생성
 * </pre>
 */
'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import {
  PositionTableList,
  PositionApi,
  Position,
  PositionSearch,
  PositionDetail,
  PositionCreate
} from '@/features/pos';

import { ContentLayout, Content, Button, Alert, Modal } from '@/shared/component';

import { createDynamicPath } from '@/shared/lib';
import { useAlertStore } from '@/shared/store';

const PositionPage = function () {
  const { showError, showSuccess } = useAlertStore.getState();
  const router = useRouter();
  const urlSearchParams = useSearchParams();

  const [searchKeyword, setSearchKeyword] = useState('');
  const [loading, setLoading] = useState(true);
  const [positionData, setPositionData] = useState([]);
  const [searchParams, setSearchParams] = useState({
    searchKeyword: ''
  });

  const [editData, setEditData] = useState(null);
  const [showAlert, setShowAlert] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const createSaveHandlerRef = useRef(null);

  // URL에서 선택된 직급 ID 파싱
  const selectedPositionId = useMemo(
    function () {
      const viewId = urlSearchParams.get('view');
      return viewId ? Number(viewId) : null;
    },
    [urlSearchParams]
  );

  // 선택된 직급 정보
  const selectedPosition = useMemo(
    () => positionData.find((pos) => pos.id === selectedPositionId) || null,
    [selectedPositionId, positionData]
  );

  // 직급 목록 로드
  const fetchList = async function () {
    setLoading(true);

    const result = await PositionApi.getList({
      ...searchParams
    });

    if (result) {
      setPositionData(Position.fromApiList(result));
    } else {
      setPositionData([]);
    }

    setLoading(false);
  };

  // URL 상태 업데이트
  const updateUrlView = function (positionId) {
    const params = new URLSearchParams(urlSearchParams);
    if (positionId) {
      params.set('view', positionId);
    } else {
      params.delete('view');
    }
    router.push(`${createDynamicPath('/sys/pos')}?${params.toString()}`);
  };

  const handleSearch = function (newSearchCriteria) {
    setSearchParams({
      ...searchParams,
      ...newSearchCriteria
    });
  };

  const handleClearSearch = function () {
    setSearchKeyword('');
    setSearchParams({
      searchKeyword: ''
    });
  };

  const handleRowClick = async function (row) {
    if (row?.id) {
      updateUrlView(row.id);

      // 상세 정보 조회
      const detail = await PositionApi.get(row.id);
      if (detail) {
        const converted = Position.fromApi(detail);
        // 목록 데이터 업데이트
        setPositionData((prev) => {
          const index = prev.findIndex((p) => p.id === row.id);
          if (index !== -1) {
            const updated = [...prev];
            updated[index] = converted;
            return updated;
          }
          return prev;
        });
        // 편집 데이터 초기화
        setEditData(converted);
      }
    }
  };

  const handleChange = function (field, value) {
    setEditData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUpdate = function () {
    setShowAlert({
      type: 'update',
      message: '직급 정보를 수정하시겠습니까?',
      variant: 'info'
    });
  };

  const handleDelete = function () {
    setShowAlert({
      type: 'delete',
      message: '직급을 삭제하시겠습니까?',
      variant: 'warning'
    });
  };

  const handleConfirmAction = (type) => {
    setShowAlert(null);
    if (type === 'update') {
      confirmUpdate();
    } else if (type === 'delete') {
      confirmDelete();
    }
  };

  const confirmUpdate = async function () {
    try {
      const updatePayload = {
        posNm: editData.posNm,
        posOrd: editData.posOrd
      };

      const result = await PositionApi.update(editData.id, updatePayload);

      if (result) {
        setShowAlert({
          type: 'success',
          message: '직급 수정이 완료되었습니다.',
          variant: 'success'
        });
        await fetchList();

        // 상세 정보 다시 로드
        const detail = await PositionApi.get(editData.id);
        if (detail) {
          setEditData(Position.fromApi(detail));
        }
      }
    } catch (error) {
      setShowAlert({
        type: 'error',
        message: '수정에 실패했습니다.',
        variant: 'error'
      });
    }
  };

  const confirmDelete = async function () {
    const result = await PositionApi.delete(selectedPosition.id);

    if (result?.success === true) {
      showSuccess('직급이 삭제되었습니다.');
      setEditData(null);
      updateUrlView(null);
      await fetchList();
    } else {
      showError({
        title: '삭제 오류',
        message: result?.error?.message || '삭제에 실패했습니다.',
        variant: 'error'
      });
    }
  };

  // 검색 파라미터 변경 시 목록 새로고침
  useEffect(
    function () {
      fetchList();
    },
    [searchParams]
  );

  // 선택된 직급 변경 시 편집 데이터 동기화
  useEffect(
    function () {
      if (selectedPosition) {
        setEditData(selectedPosition);
      } else {
        setEditData(null);
      }
    },
    [selectedPosition]
  );

  const columns = [
    { key: 'rowNumber', label: '번호' },
    { key: 'posNm', label: '직급명' },
    { key: 'posOrd', label: '정렬 순서' }
  ];

  const tableData = positionData.map(function (item, index) {
    const rowNumber = index + 1;
    return Position.toTableRow(item, rowNumber);
  });

  return (
    <ContentLayout>
      <ContentLayout.Header
        title="직급 관리"
        subtitle="직급을 조회하고 등록, 수정, 삭제합니다. 직급의 정렬 순서를 변경할 수 있습니다."
      >
        <Button variant="primary" onClick={() => setIsCreateModalOpen(true)}>
          등록
        </Button>
      </ContentLayout.Header>

      <Content.Split>
        <Content.Left>
          <div>
            <PositionSearch
              value={searchKeyword}
              onChange={function (e) {
                setSearchKeyword(e.target.value);
              }}
              onSearch={handleSearch}
              onClear={handleClearSearch}
              placeholder="직급명으로 검색..."
              disabled={loading}
            />

            <PositionTableList
              columns={columns}
              data={tableData}
              loading={loading}
              onRowClick={handleRowClick}
              showActions={false}
            />
          </div>
        </Content.Left>

        <Content.Right>
          <PositionDetail position={editData} onUpdate={handleUpdate} onDelete={handleDelete} onChange={handleChange} />
        </Content.Right>
      </Content.Split>

      {/* 등록 모달 */}
      {isCreateModalOpen && (
        <Modal
          title="직급 등록"
          variant="medium"
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          showFooter={true}
          confirmText="등록"
          cancelText="취소"
          onConfirm={() => {
            if (createSaveHandlerRef.current) {
              createSaveHandlerRef.current();
            }
          }}
        >
          <PositionCreate
            onClose={() => setIsCreateModalOpen(false)}
            onCreateSuccess={async () => {
              setIsCreateModalOpen(false);
              setSearchKeyword('');
              setSearchParams({
                searchKeyword: ''
              });
              await fetchList();
              setShowAlert({
                type: 'success',
                message: '직급이 등록되었습니다.',
                variant: 'success'
              });
            }}
            onSaveHandlerReady={(handler) => {
              createSaveHandlerRef.current = handler;
            }}
          />
        </Modal>
      )}

      {/* Alert 모달 */}
      {showAlert && (
        <Alert
          message={showAlert.message}
          variant={showAlert.variant}
          cancelText={showAlert.type === 'update' || showAlert.type === 'delete' ? '취소' : undefined}
          onConfirm={() => {
            if (showAlert.type === 'update' || showAlert.type === 'delete') {
              handleConfirmAction(showAlert.type);
            } else {
              setShowAlert(null);
            }
          }}
          onCancel={showAlert.type === 'update' || showAlert.type === 'delete' ? () => setShowAlert(null) : undefined}
          onClose={() => setShowAlert(null)}
        />
      )}
    </ContentLayout>
  );
};

export default PositionPage;
