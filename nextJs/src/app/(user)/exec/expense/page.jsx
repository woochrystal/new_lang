/**
 * 업무현황 - 비용 현황 페이지
 * @description 회사 전체 비용 결재 현황 조회 (임원급 전용)
 * @route /exec/expense
 */
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { APRV_CONSTANTS } from '@/features/aprv';
import { Button, Content, ContentLayout } from '@/shared/component';
import { createDynamicPath } from '@/shared/lib';

import { ExecExpenseApproval, ExecExpenseApprovalList, execVacExpenseApi } from '@/features/exec/aprv';
import ExecExpenseSearch from '@/features/exec/aprv/ui/ExecExpenseSearch';
import VacExpenseList from '@/features/task/vac_expense/ui/VacExpenseList';

import styles from '@/shared/component/layout/layout.module.scss';

const ExecExpensePage = () => {
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

  const [loading, setLoading] = useState(true);
  const [execExpenseData, setExecExpenseData] = useState({
    list: [],
    pagination: APRV_CONSTANTS.INITIAL_PAGINATION
  });
  const [searchParams, setSearchParams] = useState({
    page: 1,
    size: APRV_CONSTANTS.DEFAULT_PAGE_SIZE,
    startDate: initialDates.start,
    endDate: initialDates.end,
    approvalType: APRV_CONSTANTS.APPROVAL_TYPE.EXPENSE,
    approvalStatus: 'all',
    searchKeyword: ''
  });
  const [startDateState, setStartDate] = useState(initialDates.start);
  const [endDateState, setEndDate] = useState(initialDates.end);
  const [periodType, setPeriodType] = useState('1M');
  const [searchInput, setSearchInput] = useState('');
  const [approvalStatus, setApprovalStatus] = useState('all');

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

  const fetchList = async () => {
    setLoading(true);

    const result = await execVacExpenseApi.getExpenseList({
      page: searchParams.page || 1,
      size: searchParams.size || 10,
      startDt: searchParams.startDate,
      endDt: searchParams.endDate,
      aprvTy: APRV_CONSTANTS.APPROVAL_TYPE.EXPENSE,
      aprvSt: searchParams.approvalStatus,
      keyword: searchParams.searchKeyword || ''
    });

    if (result) {
      setExecExpenseData(ExecExpenseApprovalList.fromApi(result));
    } else {
      setExecExpenseData({ list: [], pagination: APRV_CONSTANTS.INITIAL_PAGINATION });
    }
    setLoading(false);
  };

  const handleSearch = async () => {
    const keyword = searchInput.trim();
    const newParams = {
      ...searchParams,
      page: 1,
      startDate: startDateState,
      endDate: endDateState,
      approvalStatus: approvalStatus,
      searchKeyword: keyword
    };
    setSearchParams(newParams);

    setLoading(true);
    const result = await execVacExpenseApi.getExpenseList({
      page: 1,
      size: newParams.size || 10,
      startDt: startDateState,
      endDt: endDateState,
      aprvTy: APRV_CONSTANTS.APPROVAL_TYPE.EXPENSE,
      aprvSt: approvalStatus,
      keyword: keyword || ''
    });

    if (result) {
      setExecExpenseData(ExecExpenseApprovalList.fromApi(result));
    } else {
      setExecExpenseData({ list: [], pagination: APRV_CONSTANTS.INITIAL_PAGINATION });
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

    setLoading(true);
    const result = await execVacExpenseApi.getExpenseList({
      page: newPage,
      size: newParams.size || 10,
      startDt: newParams.startDate,
      endDt: newParams.endDate,
      aprvTy: APRV_CONSTANTS.APPROVAL_TYPE.EXPENSE,
      aprvSt: newParams.approvalStatus,
      keyword: newParams.searchKeyword || ''
    });

    if (result) {
      setExecExpenseData(ExecExpenseApprovalList.fromApi(result));
    } else {
      setExecExpenseData({ list: [], pagination: APRV_CONSTANTS.INITIAL_PAGINATION });
    }
    setLoading(false);
  };

  // 비용결재 상세 페이지로 이동
  const handleRowClick = (row) => {
    if (row?.id) {
      router.push(createDynamicPath(`/exec/expense/detail?id=${row.id}`));
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      await fetchList();
    };

    loadInitialData();
  }, []);

  const tableData = execExpenseData.list.map((item, index) => {
    const rowNumber =
      execExpenseData.pagination?.currentPage && execExpenseData.pagination?.pageSize
        ? (execExpenseData.pagination.currentPage - 1) * execExpenseData.pagination.pageSize + index + 1
        : index + 1;

    return ExecExpenseApproval.toTableRow(item, rowNumber);
  });

  return (
    <ContentLayout>
      <ContentLayout.Header title="비용결재 현황" subtitle="부서 전체 비용 결재 현황을 조회합니다">
        <Button variant="primary" onClick={handleSearch}>
          조회
        </Button>
      </ContentLayout.Header>

      <Content.Full>
        <div className={styles.boardWrap}>
          <div className={styles.hasItem03}>
            <ExecExpenseSearch
              startDate={startDateState}
              endDate={endDateState}
              periodType={periodType}
              onDateChange={handleDateChange}
              onPeriodTypeChange={handlePeriodTypeChange}
              approvalStatusOptions={APRV_CONSTANTS.APPROVAL_PENDING_STS_OPTIONS}
              approvalStatus={approvalStatus}
              onApprovalStatusChange={setApprovalStatus}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onSearch={handleSearch}
              onClear={handleClearSearch}
              disabled={loading}
            />
          </div>

          <VacExpenseList
            columns={APRV_CONSTANTS.EXEC_EXPN_COLUMN}
            data={tableData}
            pagination={execExpenseData.pagination}
            onRowClick={handleRowClick}
            onPageChange={handlePageChange}
            loading={loading}
          />
        </div>
      </Content.Full>
    </ContentLayout>
  );
};

export default ExecExpensePage;
