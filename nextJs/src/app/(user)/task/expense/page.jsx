/**
 * 업무관리 - 비용관리 페이지
 * @description 내가 상신한 비용 결재 문서 목록 조회
 * @route /task/expense
 */
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { APRV_CONSTANTS } from '@/features/aprv';
import { Button, Content, ContentLayout } from '@/shared/component';

import { TaskExpenseApproval, TaskExpenseApprovalList, vacExpenseApi } from '@/features/task/vac_expense';
import ExpenseSearch from '@/features/task/vac_expense/ui/ExpenseSearch';
import VacExpenseList from '@/features/task/vac_expense/ui/VacExpenseList';

//공통디자인 scss
import styles from '@/shared/component/layout/layout.module.scss';
import { createDynamicPath } from '@/shared/lib';

const TaskExpensePage = () => {
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
  const [taskExpenseData, setTaskExpenseData] = useState({
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
    expenseType: 'all'
  });
  const [startDateState, setStartDate] = useState(initialDates.start);
  const [endDateState, setEndDate] = useState(initialDates.end);
  const [periodType, setPeriodType] = useState('1M');
  const [approvalStatus, setApprovalStatus] = useState('all');
  const [expenseType, setExpenseType] = useState('all');

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

    const result = await vacExpenseApi.getExpenseList({
      page: searchParams.page || 1,
      size: searchParams.size || 10,
      startDt: searchParams.startDate,
      endDt: searchParams.endDate,
      aprvTy: APRV_CONSTANTS.APPROVAL_TYPE.EXPENSE,
      aprvSt: searchParams.approvalStatus,
      expnTy: searchParams.expenseType
    });

    if (result) {
      setTaskExpenseData(TaskExpenseApprovalList.fromApi(result));
    } else {
      setTaskExpenseData({ list: [], pagination: APRV_CONSTANTS.INITIAL_PAGINATION });
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
      approvalStatus: approvalStatus,
      expenseType: expenseType
    };
    setSearchParams(newParams);

    // 검색 버튼 클릭 시 즉시 조회
    setLoading(true);
    const result = await vacExpenseApi.getExpenseList({
      page: 1,
      size: newParams.size || 10,
      startDt: startDateState,
      endDt: endDateState,
      aprvTy: APRV_CONSTANTS.APPROVAL_TYPE.EXPENSE,
      aprvSt: approvalStatus,
      expnTy: expenseType
    });

    if (result) {
      setTaskExpenseData(TaskExpenseApprovalList.fromApi(result));
    } else {
      setTaskExpenseData({ list: [], pagination: APRV_CONSTANTS.INITIAL_PAGINATION });
    }
    setLoading(false);
  };

  const handlePageChange = async (newPage) => {
    const newParams = { ...searchParams, page: newPage };
    setSearchParams(newParams);

    // 페이지 변경 시 즉시 조회
    setLoading(true);
    const result = await vacExpenseApi.getExpenseList({
      page: newPage,
      size: newParams.size || 10,
      startDt: newParams.startDate,
      endDt: newParams.endDate,
      aprvTy: APRV_CONSTANTS.APPROVAL_TYPE.EXPENSE,
      aprvSt: newParams.approvalStatus,
      expnTy: newParams.expenseType
    });

    if (result) {
      setTaskExpenseData(TaskExpenseApprovalList.fromApi(result));
    } else {
      setTaskExpenseData({ list: [], pagination: APRV_CONSTANTS.INITIAL_PAGINATION });
    }
    setLoading(false);
  };

  // 내 결재함으로 이동
  const handleRowClick = (row) => {
    if (row?.id && row?.approvalType) {
      // 결재 상세 페이지로 이동 (ty: 결재유형, id: 결재ID)
      router.push(createDynamicPath(`/aprv/myBox/detail?ty=${row.approvalType}&id=${row.id}&from=task`));
    }
  };

  // 최초 마운트 시에만 목록 조회
  useEffect(() => {
    const loadInitialData = async () => {
      await fetchList();
    };

    loadInitialData();
  }, []);

  const tableData = taskExpenseData.list.map((item, index) => {
    const rowNumber =
      taskExpenseData.pagination?.currentPage && taskExpenseData.pagination?.pageSize
        ? (taskExpenseData.pagination.currentPage - 1) * taskExpenseData.pagination.pageSize + index + 1
        : index + 1;

    return TaskExpenseApproval.toTableRow(item, rowNumber);
  });

  return (
    <ContentLayout>
      <ContentLayout.Header title="비용 현황" subtitle="내가 상신한 비용 결재 문서를 조회하고 관리합니다">
        <Button variant="primary" onClick={handleSearch}>
          조회
        </Button>
      </ContentLayout.Header>

      <Content.Full>
        <div className={styles.boardWrap}>
          {/* 검색 영역 */}
          <div className={styles.hasItem03}>
            <ExpenseSearch
              startDate={startDateState}
              endDate={endDateState}
              periodType={periodType}
              onDateChange={handleDateChange}
              onPeriodTypeChange={handlePeriodTypeChange}
              approvalStatusOptions={APRV_CONSTANTS.APPROVAL_MYBOX_STS_OPTIONS}
              approvalStatus={approvalStatus}
              onApprovalStatusChange={setApprovalStatus}
              expenseTypeOptions={APRV_CONSTANTS.EXPENSE_TYPE_SEARCH_OPTIONS}
              expenseType={expenseType}
              onExpenseTypeChange={setExpenseType}
              disabled={loading}
            />
          </div>

          {/* 테이블 + 페이지네이션 */}
          <VacExpenseList
            columns={APRV_CONSTANTS.TASK_EXPN_COLUMN}
            data={tableData}
            pagination={taskExpenseData.pagination}
            onRowClick={handleRowClick}
            onPageChange={handlePageChange}
            loading={loading}
          />
        </div>
      </Content.Full>
    </ContentLayout>
  );
};

export default TaskExpensePage;
