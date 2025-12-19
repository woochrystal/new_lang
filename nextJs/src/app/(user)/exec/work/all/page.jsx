/*
 * path           : app/(user)/exec/work/all
 * fileName       : page.jsx
 * author         : Claude
 * date           : 25.12.11
 * description    : 전체 프로젝트현황 페이지 (관리자 전용)
 * ===========================================================
 * DATE              AUTHOR        NOTE
 * -----------------------------------------------------------
 * 25.12.11        Claude       최초 생성
 */
'use client';

import { useState, useMemo } from 'react';
import { Content, ContentLayout, Button } from '@/shared/component';
import { WorkList, Search, workApi, Work, WorkListEntity, WORK_CONSTANTS } from '@/features/groupware/exec/work';
import { useApi } from '@/shared/hooks';

import styles from '@/shared/component/layout/layout.module.scss';

/**
 * 전체 프로젝트현황 페이지 (관리자 전용)
 * @returns {JSX.Element}
 */
export default function AllWorkPage() {
  // 초기 날짜 계산 (종료일: 오늘, 시작일: 1개월 전)
  const getInitialDates = function () {
    const today = new Date();
    const endDate = today.toISOString().split('T')[0];
    const startDate = new Date(today);
    startDate.setMonth(today.getMonth() - 1);
    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate
    };
  };

  const initialDates = getInitialDates();

  // Search parameters (submitted to API)
  const [searchParams, setSearchParams] = useState({
    page: 1,
    size: WORK_CONSTANTS.DEFAULT_PAGE_SIZE,
    startDate: initialDates.startDate,
    endDate: initialDates.endDate,
    periodType: '',
    searchType: '',
    searchKeyword: '',
    prjSt: '',
    empNm: ''
  });

  // Search input (user typing)
  const [searchInput, setSearchInput] = useState({
    startDate: initialDates.startDate,
    endDate: initialDates.endDate,
    periodType: '1M',
    searchType: '',
    searchKeyword: '',
    status: ''
  });

  // Period calculation helper
  const calculatePeriodDates = function (periodType) {
    if (!periodType) return { startDate: null, endDate: null };

    const today = new Date();
    const endDate = today.toISOString().split('T')[0];
    const startDate = new Date(today);

    switch (periodType) {
      case '1M':
        startDate.setMonth(today.getMonth() - 1);
        break;
      case '3M':
        startDate.setMonth(today.getMonth() - 3);
        break;
      case '6M':
        startDate.setMonth(today.getMonth() - 6);
        break;
      case '1Y':
        startDate.setFullYear(today.getFullYear() - 1);
        break;
      default:
        return { startDate: null, endDate: null };
    }

    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate
    };
  };

  // API call - admin list with search
  const { data: result, isLoading } = useApi(
    function () {
      const params = {
        page: searchParams.page,
        size: searchParams.size
      };

      if (searchParams.startDate) params.startDate = searchParams.startDate;
      if (searchParams.endDate) params.endDate = searchParams.endDate;
      if (searchParams.periodType) params.periodType = searchParams.periodType;
      if (searchParams.searchKeyword) {
        params.searchKeyword = searchParams.searchKeyword;
        params.searchType = searchParams.searchType;
      }
      if (searchParams.prjSt) params.prjSt = searchParams.prjSt;
      if (searchParams.empNm) params.empNm = searchParams.empNm;

      return workApi.getList(params);
    },
    [searchParams]
  );

  // Entity transformation
  const workData = useMemo(
    function () {
      if (!result) {
        return {
          list: [],
          pagination: {
            currentPage: 1,
            totalPages: 1,
            pageSize: WORK_CONSTANTS.DEFAULT_PAGE_SIZE,
            totalCount: 0
          }
        };
      }

      // 배열인 경우 (페이징 정보 없음)
      if (Array.isArray(result)) {
        return {
          list: result.map((item) => Work.fromApi(item)),
          pagination: {
            currentPage: 1,
            totalPages: 1,
            pageSize: result.length,
            totalCount: result.length
          }
        };
      }

      // 객체인 경우 (페이징 정보 포함)
      if (result.list && Array.isArray(result.list)) {
        return WorkListEntity.fromApi(result);
      }

      return {
        list: [],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          pageSize: WORK_CONSTANTS.DEFAULT_PAGE_SIZE,
          totalCount: 0
        }
      };
    },
    [result]
  );

  // Event handlers
  const handleDateChange = function (start, end) {
    setSearchInput({
      ...searchInput,
      startDate: start,
      endDate: end,
      periodType: ''
    });
  };

  const handlePeriodTypeChange = function (value) {
    const end = new Date();
    const start = new Date();

    switch (value) {
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

    setSearchInput({
      ...searchInput,
      periodType: value,
      startDate: formatDate(start),
      endDate: formatDate(end)
    });
  };

  const handleSearchTypeChange = function (value) {
    setSearchInput({
      ...searchInput,
      searchType: value,
      status: value === 'status' ? '' : searchInput.status,
      searchKeyword: value === 'status' ? '' : searchInput.searchKeyword
    });
  };

  const handleSearchKeywordChange = function (e) {
    setSearchInput({ ...searchInput, searchKeyword: e.target.value });
  };

  const handleStatusChange = function (value) {
    setSearchInput({ ...searchInput, status: value });
  };

  const handleSearch = function () {
    let finalStartDate = searchInput.startDate;
    let finalEndDate = searchInput.endDate;

    if (searchInput.periodType) {
      const dates = calculatePeriodDates(searchInput.periodType);
      finalStartDate = dates.startDate;
      finalEndDate = dates.endDate;
    }

    const isStatusSearch = searchInput.searchType === 'status';
    const isEmpNmSearch = searchInput.searchType === 'empNm';

    setSearchParams({
      ...searchParams,
      page: 1,
      startDate: finalStartDate,
      endDate: finalEndDate,
      periodType: searchInput.periodType,
      searchType: isStatusSearch ? '' : searchInput.searchType,
      searchKeyword: isStatusSearch ? '' : searchInput.searchKeyword.trim(),
      prjSt: isStatusSearch ? searchInput.status : '',
      empNm: isEmpNmSearch ? searchInput.searchKeyword.trim() : ''
    });
  };

  const handleClear = function () {
    const resetDates = getInitialDates();
    setSearchInput({
      startDate: resetDates.startDate,
      endDate: resetDates.endDate,
      periodType: '1M',
      searchType: '',
      searchKeyword: '',
      status: ''
    });
  };

  const handlePageChange = function (newPage) {
    setSearchParams({ ...searchParams, page: newPage });
  };

  // Admin columns include employee name
  const columns = useMemo(function () {
    return [
      { key: 'rowNumber', label: '번호', width: '80px' },
      { key: 'memberName', label: '직원명', width: '120px' },
      { key: 'client', label: '고객사', width: '150px' },
      { key: 'projectName', label: '프로젝트명' },
      { key: 'status', label: '진행상태', width: '120px' },
      { key: 'startDate', label: '투입일', width: '120px' },
      { key: 'endDate', label: '철수일', width: '120px' },
      { key: 'location', label: '장소', width: '200px' }
    ];
  }, []);

  const tableData = workData.list.map(function (item, index) {
    const rowNumber = (searchParams.page - 1) * searchParams.size + index + 1;
    return Work.toTableRow(item, rowNumber);
  });

  return (
    <ContentLayout>
      <ContentLayout.Header title="전체 프로젝트현황" subtitle="모든 프로젝트 조회 및 검색">
        <Button variant="secondary" onClick={handleClear} disabled={isLoading}>
          초기화
        </Button>
        <Button variant="primary" onClick={handleSearch} disabled={isLoading}>
          조회
        </Button>
      </ContentLayout.Header>

      <Content.Full>
        <div className={styles.boardWrap}>
          {/* Search area */}
          <div className={styles.hasItem03}>
            <Search
              startDate={searchInput.startDate}
              endDate={searchInput.endDate}
              periodType={searchInput.periodType}
              searchType={searchInput.searchType}
              searchKeyword={searchInput.searchKeyword}
              status={searchInput.status}
              onDateChange={handleDateChange}
              onPeriodTypeChange={handlePeriodTypeChange}
              onSearchTypeChange={handleSearchTypeChange}
              onSearchKeywordChange={handleSearchKeywordChange}
              onStatusChange={handleStatusChange}
              onSearch={handleSearch}
              onClear={handleClear}
              disabled={isLoading}
            />
          </div>

          {/* Table */}
          <WorkList
            data={tableData}
            columns={columns}
            pagination={workData.pagination}
            onPageChange={handlePageChange}
            loading={isLoading}
          />
        </div>
      </Content.Full>
    </ContentLayout>
  );
}
