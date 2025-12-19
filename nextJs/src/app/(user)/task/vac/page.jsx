/**
 * 업무관리 - 휴가 결재 목록 페이지
 * @description 내가 상신한 휴가 결재 문서 목록 조회
 * @route /task/vac
 */
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { APRV_CONSTANTS } from '@/features/aprv';
import { Button, Content, ContentLayout } from '@/shared/component';

import { TaskVacApproval, TaskVacApprovalList, vacExpenseApi } from '@/features/task/vac_expense';
import VacSearch from '@/features/task/vac_expense/ui/VacSearch';
import VacExpenseList from '@/features/task/vac_expense/ui/VacExpenseList';

//공통디자인 scss
import styles from '@/shared/component/layout/layout.module.scss';
import { createDynamicPath } from '@/shared/lib';
import DateCount from '@/shared/ui/Title/DateCount';

// 최근 10년 옵션 생성
const generateYearOptions = () => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 10 }, (_, i) => {
    const year = currentYear - i;
    return { value: year.toString(), label: `${year}년` };
  });
};

const TaskVacPage = () => {
  const router = useRouter();
  const currentYear = new Date().getFullYear();

  // 상태 관리
  const [loading, setLoading] = useState(true);
  const [taskVacData, setTaskVacData] = useState({
    list: [],
    pagination: APRV_CONSTANTS.INITIAL_PAGINATION
  });
  const [searchParams, setSearchParams] = useState({
    page: 1,
    size: APRV_CONSTANTS.DEFAULT_PAGE_SIZE,
    searchYear: currentYear.toString(),
    approvalType: APRV_CONSTANTS.APPROVAL_TYPE.VACATION,
    approvalStatus: 'all'
  });
  const [searchYear, setSearchYear] = useState(currentYear.toString());
  const [approvalStatus, setApprovalStatus] = useState('all');
  const [vacCntData, setVacCntData] = useState({
    totVac: 0,
    useVac: 0,
    remainVac: 0
  });

  // API: 목록 조회
  const fetchList = async () => {
    setLoading(true);

    const result = await vacExpenseApi.getVacList({
      page: searchParams.page || 1,
      size: searchParams.size || 10,
      searchYear: searchParams.searchYear,
      aprvTy: APRV_CONSTANTS.APPROVAL_TYPE.VACATION,
      aprvSt: searchParams.approvalStatus
    });

    if (result) {
      setTaskVacData(TaskVacApprovalList.fromApi(result));
    } else {
      setTaskVacData({ list: [], pagination: APRV_CONSTANTS.INITIAL_PAGINATION });
    }
    setLoading(false);
  };

  // API: 휴가 일수 조회
  const fetchVacCnt = async () => {
    const result = await vacExpenseApi.getVacCnt();
    if (result) {
      setVacCntData(result);
    }
  };

  // 이벤트: 검색
  const handleSearch = async () => {
    const newParams = {
      ...searchParams,
      page: 1,
      searchYear: searchYear,
      approvalStatus: approvalStatus
    };
    setSearchParams(newParams);

    // 검색 버튼 클릭 시 즉시 조회
    setLoading(true);
    const result = await vacExpenseApi.getVacList({
      page: 1,
      size: newParams.size || 10,
      searchYear: searchYear,
      aprvTy: APRV_CONSTANTS.APPROVAL_TYPE.VACATION,
      aprvSt: approvalStatus
    });

    if (result) {
      setTaskVacData(TaskVacApprovalList.fromApi(result));
    } else {
      setTaskVacData({ list: [], pagination: APRV_CONSTANTS.INITIAL_PAGINATION });
    }
    setLoading(false);
  };

  const handlePageChange = async (newPage) => {
    const newParams = { ...searchParams, page: newPage };
    setSearchParams(newParams);

    // 페이지 변경 시 즉시 조회
    setLoading(true);
    const result = await vacExpenseApi.getVacList({
      page: newPage,
      size: newParams.size || 10,
      searchYear: newParams.searchYear,
      aprvTy: APRV_CONSTANTS.APPROVAL_TYPE.VACATION,
      aprvSt: newParams.approvalStatus
    });

    if (result) {
      setTaskVacData(TaskVacApprovalList.fromApi(result));
    } else {
      setTaskVacData({ list: [], pagination: APRV_CONSTANTS.INITIAL_PAGINATION });
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
      await Promise.all([fetchList(), fetchVacCnt()]);
    };

    loadInitialData();
  }, []);

  const tableData = taskVacData.list.map((item, index) => {
    const rowNumber =
      taskVacData.pagination?.currentPage && taskVacData.pagination?.pageSize
        ? (taskVacData.pagination.currentPage - 1) * taskVacData.pagination.pageSize + index + 1
        : index + 1;

    return TaskVacApproval.toTableRow(item, rowNumber);
  });

  return (
    <ContentLayout>
      <ContentLayout.Header title="휴가 현황" subtitle="내가 상신한 휴가 결재 문서를 조회하고 관리합니다">
        <Button variant="primary" onClick={handleSearch}>
          조회
        </Button>
      </ContentLayout.Header>

      <Content.Full>
        <div className={styles.boardWrap}>
          {/* 검색 영역 - 검색조건 2개라서 hasItem02 선언 */}
          <div className={styles.hasItem02}>
            <VacSearch
              yearOptions={generateYearOptions()}
              searchYear={searchYear}
              onYearChange={setSearchYear}
              approvalStatusOptions={APRV_CONSTANTS.APPROVAL_MYBOX_STS_OPTIONS}
              approvalStatus={approvalStatus}
              onApprovalStatusChange={setApprovalStatus}
              disabled={loading}
            />
          </div>

          <div className={styles.hasTbBtn}>
            <div className={`${styles.tbBtnArea} ${styles.tbBtnAreaFull}`}>
              <DateCount useVac={vacCntData.useVac} remainVac={vacCntData.remainVac} />
            </div>
            {/* 테이블 + 페이지네이션 */}
            <VacExpenseList
              columns={APRV_CONSTANTS.TASK_VAC_COLUMN}
              data={tableData}
              pagination={taskVacData.pagination}
              onRowClick={handleRowClick}
              onPageChange={handlePageChange}
              loading={loading}
            />
          </div>
        </div>
      </Content.Full>
    </ContentLayout>
  );
};

export default TaskVacPage;
