/**
 * 결재현황 페이지
 * @description 부서 전체 결재 현황 조회 (부서장/관리자)
 * @route /groupware/aprv/status
 */
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import {
  ApprovalDraft,
  ApprovalDraftList,
  ApprovalList,
  ApprovalSearch,
  APRV_CONSTANTS,
  aprvApi
} from '@/features/aprv';
import { Button, Content, ContentLayout } from '@/shared/component';
import { createDynamicPath } from '@/shared/lib';

//공통디자인 scss
import styles from '@/shared/component/layout/layout.module.scss';

const StatusPage = () => {
  const router = useRouter();

  // 날짜 기본값: 최근 1개월 (Date 객체로 관리)
  const getInitialDates = () => {
    const end = new Date();
    const start = new Date();
    start.setMonth(end.getMonth() - 1);
    return { start, end };
  };

  const initialDates = getInitialDates();

  // 상태 관리
  const [loading, setLoading] = useState(true);
  const [statusData, setStatusData] = useState({
    list: [],
    pagination: APRV_CONSTANTS.INITIAL_PAGINATION
  });
  const [searchParams, setSearchParams] = useState({
    page: 1,
    size: APRV_CONSTANTS.DEFAULT_PAGE_SIZE,
    startDate: initialDates.start,
    endDate: initialDates.end,
    approvalType: 'all',
    approvalStatus: 'all',
    searchType: 'all',
    searchKeyword: ''
  });
  const [startDateState, setStartDate] = useState(initialDates.start);
  const [endDateState, setEndDate] = useState(initialDates.end);
  const [approvalType, setApprovalType] = useState('all');
  const [searchInput, setSearchInput] = useState('');
  const [searchType, setSearchType] = useState('all');
  const [approvalStatus, setApprovalStatus] = useState('all');

  // Date를 'YYYY-MM-DD' 형식으로 변환 (API 호출용)
  const formatDateToString = (date) => {
    if (!date || !(date instanceof Date)) return null;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // API: 목록 조회
  const fetchList = async () => {
    setLoading(true);

    const result = await aprvApi.getStatusList({
      page: searchParams.page || 1,
      size: searchParams.size || 10,
      startDt: formatDateToString(searchParams.startDate),
      endDt: formatDateToString(searchParams.endDate),
      aprvTy: searchParams.approvalType,
      aprvSt: searchParams.approvalStatus,
      searchType: searchParams.searchType,
      keyword: searchParams.searchKeyword || ''
    });

    if (result) {
      setStatusData(ApprovalDraftList.fromApi(result));
    } else {
      setStatusData({ list: [], pagination: APRV_CONSTANTS.INITIAL_PAGINATION });
    }
    setLoading(false);
  };

  // 이벤트: 검색
  const handleSearch = async () => {
    const keyword = searchInput.trim();
    const newParams = {
      ...searchParams,
      page: 1,
      startDate: startDateState,
      endDate: endDateState,
      approvalType: approvalType,
      approvalStatus: approvalStatus,
      searchType: searchType,
      searchKeyword: keyword
    };
    setSearchParams(newParams);

    // 검색 버튼 클릭 시 즉시 조회
    setLoading(true);
    const result = await aprvApi.getStatusList({
      page: 1,
      size: newParams.size || 10,
      startDt: formatDateToString(startDateState),
      endDt: formatDateToString(endDateState),
      aprvTy: approvalType,
      aprvSt: approvalStatus,
      searchType: searchType,
      keyword: keyword || ''
    });

    if (result) {
      setStatusData(ApprovalDraftList.fromApi(result));
    } else {
      setStatusData({ list: [], pagination: APRV_CONSTANTS.INITIAL_PAGINATION });
    }
    setLoading(false);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setSearchParams({
      ...searchParams,
      searchKeyword: ''
    });
  };

  const handlePageChange = async (newPage) => {
    const newParams = { ...searchParams, page: newPage };
    setSearchParams(newParams);

    // 페이지 변경 시 즉시 조회
    setLoading(true);
    const result = await aprvApi.getStatusList({
      page: newPage,
      size: newParams.size || 10,
      startDt: formatDateToString(newParams.startDate),
      endDt: formatDateToString(newParams.endDate),
      aprvTy: newParams.approvalType,
      aprvSt: newParams.approvalStatus,
      searchType: newParams.searchType,
      keyword: newParams.searchKeyword || ''
    });

    if (result) {
      setStatusData(ApprovalDraftList.fromApi(result));
    } else {
      setStatusData({ list: [], pagination: APRV_CONSTANTS.INITIAL_PAGINATION });
    }
    setLoading(false);
  };

  const handleRowClick = (row) => {
    if (row?.id && row?.approvalType) {
      // 결재 상세 페이지로 이동 (ty: 결재유형, id: 결재ID, from: status 상세화면에서 목록버튼을 누를때 돌아갈 화면 구분용)
      router.push(createDynamicPath(`/aprv/status/detail?ty=${row.approvalType}&id=${row.id}&from=status`));
    }
  };

  // 최초 마운트 시에만 목록 조회
  useEffect(() => {
    const loadInitialData = async () => {
      await fetchList();
    };

    loadInitialData();
  }, []);

  const tableData = statusData.list.map((item, index) => {
    const rowNumber =
      statusData.pagination?.currentPage && statusData.pagination?.pageSize
        ? (statusData.pagination.currentPage - 1) * statusData.pagination.pageSize + index + 1
        : index + 1;

    return ApprovalDraft.toTableRow(item, rowNumber);
  });

  return (
    <ContentLayout>
      <ContentLayout.Header title="결재현황" subtitle="부서 전체 결재 현황을 조회합니다">
        <Button variant="primary" onClick={handleSearch}>
          조회
        </Button>
      </ContentLayout.Header>

      <Content.Full>
        <div className={styles.boardWrap}>
          {/* 검색 영역 */}
          <ApprovalSearch
            startDate={startDateState}
            endDate={endDateState}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
            approvalTypeOptions={APRV_CONSTANTS.APPROVAL_TYPE_OPTIONS}
            approvalType={approvalType}
            onApprovalTypeChange={setApprovalType}
            approvalStatusOptions={APRV_CONSTANTS.APPROVAL_STATUS_OPTIONS}
            approvalStatus={approvalStatus}
            onApprovalStatusChange={setApprovalStatus}
            searchTypeOptions={APRV_CONSTANTS.SEARCH_TYPE_OPTIONS}
            searchType={searchType}
            onSearchTypeChange={setSearchType}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onSearch={handleSearch}
            onClear={handleClearSearch}
            disabled={loading}
          />

          {/* 테이블 + 페이지네이션 */}
          <ApprovalList
            columns={APRV_CONSTANTS.APRV_BOX_COLUMN}
            data={tableData}
            pagination={statusData.pagination}
            onRowClick={handleRowClick}
            onPageChange={handlePageChange}
            loading={loading}
          />
        </div>
      </Content.Full>
    </ContentLayout>
  );
};

export default StatusPage;
