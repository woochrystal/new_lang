/**
 * 업무현황 - 휴가 현황 페이지
 * @description 회사 전체 휴가 결재 현황 조회 (임원급 전용)
 * @route /exec/vac
 */
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { APRV_CONSTANTS } from '@/features/aprv';
import { Button, Content, ContentLayout } from '@/shared/component';
import { createDynamicPath } from '@/shared/lib';

import { ExecVacApproval, ExecVacApprovalList, execVacExpenseApi } from '@/features/exec/aprv';
import ExecVacSearch from '@/features/exec/aprv/ui/ExecVacSearch';
import VacExpenseList from '@/features/task/vac_expense/ui/VacExpenseList';

import styles from '@/shared/component/layout/layout.module.scss';

const ExecVacPage = () => {
  const router = useRouter();

  // 최근 10년 옵션 생성
  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 10 }, (_, i) => {
      const year = currentYear - i;
      return { value: year.toString(), label: `${year}년` };
    });
  };

  const currentYear = new Date().getFullYear();

  const [loading, setLoading] = useState(true);
  const [execVacData, setExecVacData] = useState({
    list: [],
    pagination: APRV_CONSTANTS.INITIAL_PAGINATION
  });
  const [searchParams, setSearchParams] = useState({
    page: 1,
    size: APRV_CONSTANTS.DEFAULT_PAGE_SIZE,
    searchYear: currentYear.toString(),
    approvalType: APRV_CONSTANTS.APPROVAL_TYPE.VACATION,
    approvalStatus: 'all',
    searchKeyword: ''
  });
  const [searchYear, setSearchYear] = useState(currentYear.toString());
  const [searchInput, setSearchInput] = useState('');
  const [approvalStatus, setApprovalStatus] = useState('all');

  const fetchList = async () => {
    setLoading(true);

    const result = await execVacExpenseApi.getVacList({
      page: searchParams.page || 1,
      size: searchParams.size || 10,
      searchYear: searchParams.searchYear,
      aprvTy: APRV_CONSTANTS.APPROVAL_TYPE.VACATION,
      aprvSt: searchParams.approvalStatus,
      keyword: searchParams.searchKeyword || ''
    });

    if (result) {
      setExecVacData(ExecVacApprovalList.fromApi(result));
    } else {
      setExecVacData({ list: [], pagination: APRV_CONSTANTS.INITIAL_PAGINATION });
    }
    setLoading(false);
  };

  const handleSearch = async () => {
    const keyword = searchInput.trim();
    const newParams = {
      ...searchParams,
      page: 1,
      searchYear: searchYear,
      approvalStatus: approvalStatus,
      searchKeyword: keyword
    };
    setSearchParams(newParams);

    setLoading(true);
    const result = await execVacExpenseApi.getVacList({
      page: 1,
      size: newParams.size || 10,
      searchYear: searchYear,
      aprvTy: APRV_CONSTANTS.APPROVAL_TYPE.VACATION,
      aprvSt: approvalStatus,
      keyword: keyword || ''
    });

    if (result) {
      setExecVacData(ExecVacApprovalList.fromApi(result));
    } else {
      setExecVacData({ list: [], pagination: APRV_CONSTANTS.INITIAL_PAGINATION });
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
    const result = await execVacExpenseApi.getVacList({
      page: newPage,
      size: newParams.size || 10,
      searchYear: newParams.searchYear,
      aprvTy: APRV_CONSTANTS.APPROVAL_TYPE.VACATION,
      aprvSt: newParams.approvalStatus,
      keyword: newParams.searchKeyword || ''
    });

    if (result) {
      setExecVacData(ExecVacApprovalList.fromApi(result));
    } else {
      setExecVacData({ list: [], pagination: APRV_CONSTANTS.INITIAL_PAGINATION });
    }
    setLoading(false);
  };

  // 휴가결재 상세 페이지로 이동
  const handleRowClick = (row) => {
    if (row?.id) {
      router.push(createDynamicPath(`/exec/vac/detail?id=${row.id}`));
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      await fetchList();
    };

    loadInitialData();
  }, []);

  const tableData = execVacData.list.map((item, index) => {
    const rowNumber =
      execVacData.pagination?.currentPage && execVacData.pagination?.pageSize
        ? (execVacData.pagination.currentPage - 1) * execVacData.pagination.pageSize + index + 1
        : index + 1;

    return ExecVacApproval.toTableRow(item, rowNumber);
  });

  return (
    <ContentLayout>
      <ContentLayout.Header title="휴가결재 현황" subtitle="부서 전체 휴가 결재 현황을 조회합니다">
        <Button variant="primary" onClick={handleSearch}>
          조회
        </Button>
      </ContentLayout.Header>

      <Content.Full>
        <div className={styles.boardWrap}>
          <div className={styles.hasItem03}>
            <ExecVacSearch
              yearOptions={generateYearOptions()}
              searchYear={searchYear}
              onYearChange={setSearchYear}
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
            columns={APRV_CONSTANTS.EXEC_VAC_COLUMN}
            data={tableData}
            pagination={execVacData.pagination}
            onRowClick={handleRowClick}
            onPageChange={handlePageChange}
            loading={loading}
          />
        </div>
      </Content.Full>
    </ContentLayout>
  );
};

export default ExecVacPage;
