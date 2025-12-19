/**
 * <pre>
 * path           : app/(user)/prt
 * fileName       : PartnerPage
 * author         : hmlee
 * date           : 25. 11. 10.
 * description    : 협력사 현황 관리 페이지
 * ===========================================================
 * DATE              AUTHOR        NOTE
 * -----------------------------------------------------------
 * 25. 11. 10.        hmlee       최초 생성
 * </pre>
 */
'use client';

import { useState, useMemo, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import {
  PartnerDetail,
  PartnerSearch,
  PartnerTableList,
  PartnerCreate,
  partnerApi,
  PARTNER_CONSTANTS,
  PartnerList,
  Partner
} from '@/features/prt';
import { Content, ContentLayout, Button, Modal, Label } from '@/shared/component';
import { createDynamicPath } from '@/shared/lib';
import { useAlertStore } from '@/shared/store';
import { useApi } from '@/shared/hooks';

import styles from '@/shared/component/layout/layout.module.scss';
import inputStyles from '@/shared/component/input/input.module.scss';
import RadioButton from '@/features/prt/ui/RadioButton';
import DatepickerGroup from '@/shared/ui/Input/DatepickerGroup';

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getInitialDates = () => {
  const end = new Date();
  const start = new Date();
  start.setMonth(end.getMonth() - 1);
  return {
    startDate: formatDate(start),
    endDate: formatDate(end)
  };
};

const PartnerPage = function () {
  const router = useRouter();
  const urlSearchParams = useSearchParams();

  const selectedPartnerId = useMemo(
    function () {
      const viewId = urlSearchParams.get('view');
      return viewId ? Number(viewId) : null;
    },
    [urlSearchParams]
  );

  const initialDates = getInitialDates();

  const [searchParams, setSearchParams] = useState({
    page: 1,
    size: PARTNER_CONSTANTS.DEFAULT_PAGE_SIZE,
    searchKeyword: '',
    periodType: '',
    startDate: initialDates.startDate,
    endDate: initialDates.endDate
  });

  const [refetchTrigger, setRefetchTrigger] = useState(0);

  const [searchKeyword, setSearchKeyword] = useState('');
  const [periodType, setPeriodType] = useState('1M');
  const [startDate, setStartDate] = useState(initialDates.startDate);
  const [endDate, setEndDate] = useState(initialDates.endDate);

  const [isEditMode, setIsEditMode] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const updateSaveHandlerRef = useRef(null);
  const createSaveHandlerRef = useRef(null);

  const { data: apiResult, isLoading } = useApi(
    function () {
      const params = {
        ...searchParams
      };
      return partnerApi.getList(params);
    },
    [searchParams, refetchTrigger]
  );

  const partnerData = useMemo(() => {
    if (!apiResult) {
      return {
        list: [],
        pagination: { currentPage: 1, totalPages: 1, pageSize: 10, totalCount: 0 }
      };
    }
    return PartnerList.fromApi(apiResult);
  }, [apiResult]);

  // URL 상태 업데이트
  const updateUrlView = function (partnerId) {
    const params = new URLSearchParams(urlSearchParams);
    if (partnerId) {
      params.set('view', partnerId);
    } else {
      params.delete('view');
    }
    router.push(`${createDynamicPath('/prt')}?${params.toString()}`);
  };

  const handleSearch = function (newSearchCriteria) {
    setSearchParams({
      ...searchParams,
      ...newSearchCriteria,
      page: 1
    });
  };

  const handleClearSearch = function () {
    setSearchKeyword('');
    setStartDate(null);
    setEndDate(null);
    setPeriodType('');
  };

  const handlePageChange = function (newPage) {
    setSearchParams({ ...searchParams, page: newPage });
  };

  const handleRowClick = function (row) {
    if (row?.id) {
      updateUrlView(row.id);
      setIsDetailModalOpen(true);
    }
  };

  const handleCloseDetailModal = function () {
    setIsDetailModalOpen(false);
    setIsEditMode(false);
    updateUrlView(null);
  };

  // 기간 타입 변경 핸들러
  const handlePeriodTypeChange = (type) => {
    setPeriodType(type);

    const end = new Date();
    const start = new Date();

    switch (type) {
      case '1M':
        start.setMonth(end.getMonth() - 1);
        break;
      case '3M':
        start.setMonth(end.getMonth() - 3);
        break;
      case '6M':
        start.setMonth(end.getMonth() - 6);
        break;
      case '1Y':
        start.setFullYear(end.getFullYear() - 1);
        break;
      default:
        break;
    }

    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    setStartDate(formatDate(start));
    setEndDate(formatDate(end));
  };

  const handleUpdateSuccess = function () {
    const { showSuccess } = useAlertStore.getState();
    showSuccess('협력사 정보가 수정되었습니다.');

    handleCloseDetailModal();
    setRefetchTrigger((prev) => prev + 1);
  };

  const handleDeleteSuccess = function () {
    handleCloseDetailModal();
    setRefetchTrigger((prev) => prev + 1);
  };

  const columns = [
    { key: 'rowNumber', label: '번호' },
    { key: 'ptnrNm', label: '협력사명' },
    { key: 'ceoNm', label: '대표자명' },
    { key: 'bsnsRegNo', label: '사업자등록번호' },
    { key: 'mainSvc', label: '주요서비스' },
    { key: 'createdAt', label: '등록일' }
  ];

  const tableData = partnerData.list.map(function (item, index) {
    const rowNumber =
      partnerData.pagination?.currentPage && partnerData.pagination?.pageSize
        ? (partnerData.pagination.currentPage - 1) * partnerData.pagination.pageSize + index + 1
        : index + 1;

    return Partner.toTableRow(item, rowNumber);
  });

  return (
    <ContentLayout>
      <ContentLayout.Header title="협력사 현황" subtitle="협력사 현황을 조회하고 등록, 수정, 삭제합니다.">
        <Button
          variant="primary"
          onClick={() =>
            handleSearch({
              searchKeyword: searchKeyword.trim(),
              periodType: periodType,
              startDate: startDate,
              endDate: endDate
            })
          }
        >
          조회
        </Button>
        <Button variant="secondary" onClick={handleClearSearch}>
          초기화
        </Button>
      </ContentLayout.Header>

      <Content.Full>
        <div className={styles.boardWrap}>
          <div className={`${styles.hasItem03}`}>
            {/* 검색 영역 */}
            <div className={inputStyles.wrapper}>
              <Label>등록일</Label>
              <DatepickerGroup
                startDate={startDate}
                endDate={endDate}
                onChange={(start, end) => {
                  setStartDate(start);
                  setEndDate(end);
                  setPeriodType(null);
                }}
                disabled={isLoading}
              />
              <div className={styles.dateRangeBtn}>
                <RadioButton value={periodType} onChange={handlePeriodTypeChange} disabled={isLoading} />
              </div>
            </div>
            <PartnerSearch
              value={searchKeyword}
              periodType={periodType}
              startDate={startDate}
              endDate={endDate}
              onChange={function (e) {
                setSearchKeyword(e.target.value);
              }}
              onSearch={handleSearch}
              onClear={function () {
                setSearchKeyword('');
              }}
              placeholder="협력사 이름 검색"
              disabled={isLoading}
            />
          </div>

          <div className={`${styles.hasTbBtn}`}>
            <div className={`${styles.tbBtnArea} ${styles.tbBtnAreaFull}`}>
              <Button variant="primary" onClick={() => setIsCreateModalOpen(true)}>
                등록
              </Button>
            </div>

            {/* 테이블 + 페이지네이션 */}
            <PartnerTableList
              columns={columns}
              data={tableData}
              pagination={partnerData.pagination}
              onRowClick={handleRowClick}
              onPageChange={handlePageChange}
              loading={isLoading}
            />
          </div>
        </div>
      </Content.Full>

      {/* 상세보기 Modal */}
      {selectedPartnerId && isDetailModalOpen && (
        <Modal
          title="협력사 상세"
          variant="large"
          isOpen={isDetailModalOpen}
          onClose={handleCloseDetailModal}
          showFooter={true}
          confirmText={isEditMode ? '수정하기' : '확인'}
          onConfirm={
            isEditMode
              ? () => {
                  if (updateSaveHandlerRef.current) {
                    updateSaveHandlerRef.current();
                  }
                }
              : handleCloseDetailModal
          }
        >
          <PartnerDetail
            partnerId={selectedPartnerId}
            onBack={handleCloseDetailModal}
            onDelete={handleDeleteSuccess}
            onEditModeChange={setIsEditMode}
            onSaveHandlerReady={(handler) => {
              updateSaveHandlerRef.current = handler;
            }}
            onUpdateSuccess={handleUpdateSuccess}
            showActions={true}
          />
        </Modal>
      )}

      {isCreateModalOpen && (
        <Modal
          title="협력사 등록"
          variant="large"
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
          <PartnerCreate
            onClose={() => setIsCreateModalOpen(false)}
            onCreateSuccess={() => {
              const { showSuccess } = useAlertStore.getState();
              showSuccess('협력사가 등록되었습니다.');
              setIsCreateModalOpen(false);
              setRefetchTrigger((prev) => prev + 1);
            }}
            onSaveHandlerReady={(handler) => {
              createSaveHandlerRef.current = handler;
            }}
          />
        </Modal>
      )}
    </ContentLayout>
  );
};

export default PartnerPage;
