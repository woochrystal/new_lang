/**
 * <pre>
 * path           : app/(admin)/joinMng
 * fileName       : JoinMngPage
 * author         : hmlee
 * date           : 25. 12. 02.
 * description    : 가입신청 관리 페이지
 * ===========================================================
 * DATE              AUTHOR        NOTE
 * -----------------------------------------------------------
 * 25. 12. 02.        hmlee       최초 생성
 * </pre>
 */
'use client';

import { useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import {
  JoinMngDetail,
  JoinMngSearch,
  JoinMngTableList,
  joinMngApi,
  JOINMNG_CONSTANTS,
  JoinMngList,
  JoinMng
} from '@/features/joinMng';
import { Content, ContentLayout, Button, Modal, Label, Select } from '@/shared/component';
import { createDynamicPath } from '@/shared/lib';
import { useAlertStore } from '@/shared/store';
import { useApi } from '@/shared/hooks';

import styles from '@/shared/component/layout/layout.module.scss';
import inputStyles from '@/shared/component/input/input.module.scss';
import DatepickerGroup from '@/shared/ui/Input/DatepickerGroup';
import RadioButton from '@/features/joinMng/ui/RadioButton';

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

const JoinMngPage = function () {
  const router = useRouter();
  const urlSearchParams = useSearchParams();

  const selectedJoinMngId = useMemo(
    function () {
      const viewId = urlSearchParams.get('view');
      return viewId ? Number(viewId) : null;
    },
    [urlSearchParams]
  );

  const initialDates = getInitialDates();

  const [searchParams, setSearchParams] = useState({
    page: 1,
    size: JOINMNG_CONSTANTS.DEFAULT_PAGE_SIZE,
    searchKeyword: '',
    joinSt: '',
    startDate: initialDates.startDate,
    endDate: initialDates.endDate
  });

  const [refetchTrigger, setRefetchTrigger] = useState(0);

  const [searchKeyword, setSearchKeyword] = useState('');
  const [approvalStatus, setApprovalStatus] = useState('');
  const [periodType, setPeriodType] = useState('1M');
  const [startDate, setStartDate] = useState(initialDates.startDate);
  const [endDate, setEndDate] = useState(initialDates.endDate);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const { showSuccess } = useAlertStore.getState();

  const { data: apiResult, isLoading } = useApi(
    function () {
      const params = {
        ...searchParams
      };
      return joinMngApi.getList(params);
    },
    [searchParams, refetchTrigger]
  );

  const joinMngData = useMemo(
    function () {
      if (!apiResult) {
        return {
          list: [],
          pagination: { currentPage: 1, totalPages: 1, pageSize: JOINMNG_CONSTANTS.DEFAULT_PAGE_SIZE, totalCount: 0 }
        };
      }
      return JoinMngList.fromApi(apiResult);
    },
    [apiResult]
  );

  // URL 상태 업데이트
  const updateUrlView = function (joinMngId) {
    const params = new URLSearchParams(urlSearchParams);
    if (joinMngId) {
      params.set('view', joinMngId);
    } else {
      params.delete('view');
    }
    router.push(`${createDynamicPath('/joinMng')}?${params.toString()}`);
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
    setApprovalStatus('');
  };

  const handlePageChange = function (newPage) {
    setSearchParams({ ...searchParams, page: newPage });
  };

  const handleRowClick = function (row) {
    if (row?.joinId) {
      updateUrlView(row.joinId);
      setIsDetailModalOpen(true);
    }
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

    setStartDate(formatDate(start));
    setEndDate(formatDate(end));
  };

  const handleCloseDetailModal = function () {
    setIsDetailModalOpen(false);
    updateUrlView(null);
  };

  const handleActionSuccess = function () {
    showSuccess('처리되었습니다.');
    handleCloseDetailModal();
    setRefetchTrigger((prev) => prev + 1);
  };

  const handleDeleteSuccess = function () {
    showSuccess('삭제되었습니다.');
    handleCloseDetailModal();
    setRefetchTrigger((prev) => prev + 1);
  };

  const columns = useMemo(function () {
    return [
      { key: 'rowNumber', label: '순번' },
      { key: 'regDtm', label: '신청일' },
      { key: 'tenantNm', label: '회사명' },
      { key: 'domainPath', label: '도메인' },
      { key: 'mgrNm', label: '담당자' },
      { key: 'mgrTel', label: '연락처' },
      { key: 'apprStatusNm', label: '승인상태' }
    ];
  }, []);

  const tableData = joinMngData.list.map(function (item, index) {
    const rowNumber =
      joinMngData.pagination?.currentPage && joinMngData.pagination?.pageSize
        ? (joinMngData.pagination.currentPage - 1) * joinMngData.pagination.pageSize + index + 1
        : index + 1;

    return JoinMng.toTableRow(item, rowNumber);
  });

  return (
    <ContentLayout>
      <ContentLayout.Header title="가입신청 관리" subtitle="기업의 가입신청을 조회하고 승인 또는 반려합니다.">
        <Button
          variant="primary"
          onClick={function () {
            handleSearch({
              searchKeyword: searchKeyword.trim(),
              joinSt: approvalStatus,
              startDate: startDate,
              endDate: endDate
            });
          }}
          disabled={isLoading}
        >
          조회
        </Button>
        <Button variant="secondary" onClick={handleClearSearch} disabled={isLoading}>
          초기화
        </Button>
      </ContentLayout.Header>

      <Content.Full>
        <div className={styles.boardWrap}>
          {/* 검색 영역 */}
          <div className={`${styles.hasItem03}`}>
            <div className={inputStyles.wrapper}>
              <Label>신청일</Label>
              <DatepickerGroup
                startDate={startDate}
                endDate={endDate}
                onChange={(start, end) => {
                  setStartDate(start);
                  setEndDate(end);
                  setApprovalStatus('');
                }}
                disabled={isLoading}
              />
              <div className={styles.dateRangeBtn}>
                <RadioButton value={periodType} onChange={handlePeriodTypeChange} disabled={isLoading} />
              </div>
            </div>
            <div className={inputStyles.wrapper}>
              <Label>승인상태</Label>
              <Select
                options={JOINMNG_CONSTANTS.APPROVAL_STS_OPTIONS}
                value={approvalStatus}
                onChange={setApprovalStatus}
                placeholder="전체"
                disabled={isLoading}
              />
            </div>
            <JoinMngSearch
              value={searchKeyword}
              onChange={function (e) {
                setSearchKeyword(e.target.value);
              }}
              onSearch={handleSearch}
              onClear={function () {
                setSearchKeyword('');
              }}
              startDate={startDate}
              endDate={endDate}
              approvalStatus={approvalStatus}
              placeholder="회사명, 도메인 검색"
              disabled={isLoading}
            />
          </div>
          <div>
            {/* 테이블 + 페이지네이션 */}
            <JoinMngTableList
              columns={columns}
              data={tableData}
              pagination={joinMngData.pagination}
              onRowClick={handleRowClick}
              onPageChange={handlePageChange}
              loading={isLoading}
            />
          </div>
        </div>
      </Content.Full>

      {/* 상세보기 Modal */}
      {selectedJoinMngId && isDetailModalOpen && (
        <Modal
          title="가입신청 상세"
          variant="large"
          isOpen={isDetailModalOpen}
          onClose={handleCloseDetailModal}
          showFooter={true}
          confirmText="닫기"
          onConfirm={handleCloseDetailModal}
        >
          <JoinMngDetail
            joinReqId={selectedJoinMngId}
            onBack={handleCloseDetailModal}
            onDelete={handleDeleteSuccess}
            onApprove={handleActionSuccess}
            onReject={handleActionSuccess}
          />
        </Modal>
      )}
    </ContentLayout>
  );
};

export default JoinMngPage;
