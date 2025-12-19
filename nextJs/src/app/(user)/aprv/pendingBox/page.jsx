/**
 * 결재진행함 페이지
 * @description 내가 결재해야 하는 문서 목록 조회
 * @route /groupware/aprv/pendingBox
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

const PendingBoxPage = () => {
  const router = useRouter();

  // 날짜 기본값: 최근 1개월 (YYYY-MM-DD 문자열 형식)
  const getInitialDates = () => {
    const end = new Date();
    const start = new Date();
    start.setMonth(end.getMonth() - 1);

    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    return { start: formatDate(start), end: formatDate(end) };
  };

  const initialDates = getInitialDates();

  // 상태 관리
  const [loading, setLoading] = useState(true);
  const [pendingBoxData, setPendingBoxData] = useState({
    list: [],
    pagination: APRV_CONSTANTS.INITIAL_PAGINATION
  });
  const [searchParams, setSearchParams] = useState({
    page: 1,
    size: APRV_CONSTANTS.DEFAULT_PAGE_SIZE,
    startDate: initialDates.start,
    endDate: initialDates.end,
    approvalType: 'all',
    approvalStatus: 'all'
  });
  const [startDateState, setStartDate] = useState(initialDates.start);
  const [endDateState, setEndDate] = useState(initialDates.end);
  const [approvalType, setApprovalType] = useState('all');
  const [approvalStatus, setApprovalStatus] = useState('all');
  const [periodType, setPeriodType] = useState('1M');

  // 날짜 변경 핸들러
  const handleDateChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
    setPeriodType(''); // 날짜 직접 선택 시 기간 타입 초기화
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

  // API: 목록 조회
  const fetchList = async () => {
    setLoading(true);

    const result = await aprvApi.getPendingBoxList({
      page: searchParams.page || 1,
      size: searchParams.size || 10,
      startDt: searchParams.startDate,
      endDt: searchParams.endDate,
      aprvTy: searchParams.approvalType,
      aprvSt: searchParams.approvalStatus
    });

    if (result) {
      setPendingBoxData(ApprovalDraftList.fromApi(result));
    } else {
      setPendingBoxData({ list: [], pagination: APRV_CONSTANTS.INITIAL_PAGINATION });
    }
    setLoading(false);
  };

  // 이벤트: 검색
  const handleSearch = async () => {
    const newParams = {
      ...searchParams,
      page: 1,
      startDate: startDateState,
      endDate: endDateState,
      approvalType: approvalType,
      approvalStatus: approvalStatus
    };
    setSearchParams(newParams);

    // 검색 버튼 클릭 시 즉시 조회
    setLoading(true);
    const result = await aprvApi.getPendingBoxList({
      page: 1,
      size: newParams.size || 10,
      startDt: startDateState,
      endDt: endDateState,
      aprvTy: approvalType,
      aprvSt: approvalStatus
    });

    if (result) {
      setPendingBoxData(ApprovalDraftList.fromApi(result));
    } else {
      setPendingBoxData({ list: [], pagination: APRV_CONSTANTS.INITIAL_PAGINATION });
    }
    setLoading(false);
  };

  const handlePageChange = async (newPage) => {
    const newParams = { ...searchParams, page: newPage };
    setSearchParams(newParams);

    // 페이지 변경 시 즉시 조회
    setLoading(true);
    const result = await aprvApi.getPendingBoxList({
      page: newPage,
      size: newParams.size || 10,
      startDt: newParams.startDate,
      endDt: newParams.endDate,
      aprvTy: newParams.approvalType,
      aprvSt: newParams.approvalStatus
    });

    if (result) {
      setPendingBoxData(ApprovalDraftList.fromApi(result));
    } else {
      setPendingBoxData({ list: [], pagination: APRV_CONSTANTS.INITIAL_PAGINATION });
    }
    setLoading(false);
  };

  const handleRowClick = (row) => {
    if (row?.id && row?.approvalType) {
      // 결재 상세 페이지로 이동 (ty: 결재유형, id: 결재ID)
      router.push(createDynamicPath(`/aprv/pendingBox/detail?ty=${row.approvalType}&id=${row.id}`));
    }
  };

  // 최초 마운트 시에만 목록 조회
  useEffect(() => {
    const loadInitialData = async () => {
      await fetchList();
    };

    loadInitialData();
  }, []);

  const tableData = pendingBoxData.list.map((item, index) => {
    const rowNumber =
      pendingBoxData.pagination?.currentPage && pendingBoxData.pagination?.pageSize
        ? (pendingBoxData.pagination.currentPage - 1) * pendingBoxData.pagination.pageSize + index + 1
        : index + 1;

    return ApprovalDraft.toPendingBoxTableRow(item, rowNumber);
  });

  return (
    <ContentLayout>
      <ContentLayout.Header title="결재대기" subtitle="내가 결재해야 하는 문서 목록을 조회하고 관리합니다">
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
            periodType={periodType}
            onDateChange={handleDateChange}
            onPeriodTypeChange={handlePeriodTypeChange}
            approvalTypeOptions={APRV_CONSTANTS.APPROVAL_TYPE_OPTIONS}
            approvalType={approvalType}
            onApprovalTypeChange={setApprovalType}
            approvalStatusOptions={APRV_CONSTANTS.APPROVAL_PENDING_STS_OPTIONS}
            approvalStatus={approvalStatus}
            onApprovalStatusChange={setApprovalStatus}
            disabled={loading}
          />

          {/* 테이블 + 페이지네이션 */}
          <ApprovalList
            columns={APRV_CONSTANTS.APRV_PENDING_COLUMN}
            data={tableData}
            pagination={pendingBoxData.pagination}
            onRowClick={handleRowClick}
            onPageChange={handlePageChange}
            loading={loading}
          />
        </div>
      </Content.Full>
    </ContentLayout>
  );
};

export default PendingBoxPage;
