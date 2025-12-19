/**
 * @fileoverview 프로젝트관리 목록 페이지
 * @description 프로젝트 목록 조회 및 검색
 */

'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';

import { Search, List, api as workApi, WORK_CONSTANTS, ProjectList, Project } from '@/features/groupware/task/work';
import { Content, ContentLayout, Button } from '@/shared/component';
import { useApi } from '@/shared/hooks';
import { createDynamicPath } from '@/shared/lib/routing';
import { useAlertStore } from '@/shared/store';

import styles from '@/shared/component/layout/layout.module.scss';

const TaskWorkPage = function () {
  const router = useRouter();
  const { showError, showConfirm, showSuccess } = useAlertStore();

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

  // 검색 상태
  const [searchParams, setSearchParams] = useState({
    page: 1,
    size: WORK_CONSTANTS.DEFAULT_PAGE_SIZE,
    startDate: initialDates.startDate,
    endDate: initialDates.endDate,
    periodType: '',
    searchType: '',
    searchKeyword: '',
    prjSt: ''
  });

  const [searchInput, setSearchInput] = useState({
    startDate: initialDates.startDate,
    endDate: initialDates.endDate,
    periodType: '1M',
    searchType: '',
    searchKeyword: '',
    status: ''
  });

  // 선택된 항목
  const [selectedIds, setSelectedIds] = useState([]);

  // 프로젝트 목록 로드
  const { data: result, isLoading } = useApi(() => {
    // 검색 파라미터 구성
    const params = {
      page: searchParams.page || 1,
      size: searchParams.size || WORK_CONSTANTS.DEFAULT_PAGE_SIZE,
      sortBy: 'regDtm',
      sortOrder: 'DESC'
    };

    // 날짜 조건 추가
    if (searchParams.startDate) {
      params.startDate = searchParams.startDate;
    }
    if (searchParams.endDate) {
      params.endDate = searchParams.endDate;
    }

    // 기간 타입 추가
    if (searchParams.periodType) {
      params.periodType = searchParams.periodType;
    }

    // 검색 조건 추가
    if (searchParams.searchKeyword) {
      params.searchKeyword = searchParams.searchKeyword;
      params.searchType = searchParams.searchType || undefined;
    }

    // 상태 필터 추가
    if (searchParams.prjSt) {
      params.prjSt = searchParams.prjSt;
    }

    return workApi.search(params);
  }, [searchParams]);

  // 응답 데이터 정규화
  const projectData = useMemo(
    function () {
      if (!result || !result.list) {
        return {
          list: [],
          pagination: { currentPage: 1, totalPages: 1, pageSize: WORK_CONSTANTS.DEFAULT_PAGE_SIZE, totalCount: 0 }
        };
      }

      return ProjectList.fromApi(result);
    },
    [result]
  );

  // 이벤트 핸들러 - 날짜 변경
  const handleDateChange = function (start, end) {
    setSearchInput({
      ...searchInput,
      startDate: start,
      endDate: end,
      periodType: ''
    });
  };

  // 기간 타입 변경
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

  // 이벤트 핸들러 - 검색
  const handleSearch = function () {
    // searchType이 'status'일 때는 진행상태로만 검색
    const isStatusSearch = searchInput.searchType === 'status';

    setSearchParams({
      ...searchParams,
      page: 1,
      startDate: searchInput.startDate,
      endDate: searchInput.endDate,
      periodType: searchInput.periodType,
      searchType: isStatusSearch ? '' : searchInput.searchType,
      searchKeyword: isStatusSearch ? '' : searchInput.searchKeyword.trim(),
      prjSt: isStatusSearch ? searchInput.status : ''
    });
    setSelectedIds([]);
  };

  // 초기화 핸들러 (조회조건만 초기화, 재조회 안함)
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

  const handleRowClick = function (row) {
    if (row && row.id) {
      router.push(createDynamicPath(`/task/work/edit?id=${row.id}`));
    }
  };

  // 삭제 핸들러
  const handleDelete = function () {
    if (selectedIds.length === 0) {
      showError({
        title: '알림',
        message: '삭제할 프로젝트를 선택해주세요.'
      });
      return;
    }

    showConfirm({
      title: '프로젝트 삭제',
      message: `선택한 ${selectedIds.length}개의 프로젝트를 삭제하시겠습니까?`,
      onConfirm: async function () {
        for (const id of selectedIds) {
          await workApi.delete(id);
        }
        showSuccess('선택한 프로젝트가 삭제되었습니다.');
        setSelectedIds([]);
        // 목록 새로고침
        setSearchParams({ ...searchParams });
      },
      variant: 'warning',
      confirmText: '삭제',
      cancelText: '취소'
    });
  };

  // 체크박스 선택 핸들러
  const handleSelect = function (id) {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((selectedId) => selectedId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // 전체 선택/해제
  const handleSelectAll = function () {
    if (selectedIds.length === projectData.list.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(projectData.list.map((project) => project.id));
    }
  };

  // 테이블 데이터 변환
  const tableData = projectData.list.map(function (item, index) {
    const rowNumber =
      projectData.pagination?.currentPage && projectData.pagination?.pageSize
        ? (projectData.pagination.currentPage - 1) * projectData.pagination.pageSize + index + 1
        : index + 1;

    return Project.toTableRow(item, rowNumber);
  });

  return (
    <ContentLayout>
      <ContentLayout.Header title="프로젝트 관리" subtitle="프로젝트 목록 조회 및 관리">
        <Button variant="secondary" onClick={handleClear} disabled={isLoading}>
          초기화
        </Button>
        <Button variant="primary" onClick={handleSearch} disabled={isLoading}>
          조회
        </Button>
      </ContentLayout.Header>

      <Content.Full>
        <div className={styles.boardWrap}>
          {/* 검색 영역 */}
          <div className={styles.hasItem04}>
            <Search
              startDate={searchInput.startDate}
              endDate={searchInput.endDate}
              periodType={searchInput.periodType}
              searchType={searchInput.searchType}
              searchKeyword={searchInput.searchKeyword}
              status={searchInput.status}
              onDateChange={handleDateChange}
              onPeriodTypeChange={handlePeriodTypeChange}
              onSearchTypeChange={function (value) {
                // searchType 변경 시 status와 searchKeyword 초기화
                setSearchInput({
                  ...searchInput,
                  searchType: value,
                  status: value === 'status' ? '' : searchInput.status,
                  searchKeyword: value === 'status' ? '' : searchInput.searchKeyword
                });
              }}
              onSearchKeywordChange={function (e) {
                setSearchInput({ ...searchInput, searchKeyword: e.target.value });
              }}
              onStatusChange={function (value) {
                setSearchInput({ ...searchInput, status: value });
              }}
              onSearch={handleSearch}
              onClear={handleClear}
              disabled={isLoading}
            />
          </div>

          {/* 액션 버튼 + 테이블 영역 */}
          <div className={styles.hasTbBtn}>
            <div className={`${styles.tbBtnArea} ${styles.tbBtnAreaFull}`}>
              <Button
                variant="primary"
                onClick={function () {
                  router.push(createDynamicPath('/task/work/write'));
                }}
              >
                등록
              </Button>
              <Button variant="danger" onClick={handleDelete}>
                삭제
              </Button>
            </div>

            {/* 테이블 + 페이지네이션 */}
            <List
              columns={WORK_CONSTANTS.COLUMNS}
              data={tableData}
              pagination={projectData.pagination}
              onRowClick={handleRowClick}
              onPageChange={handlePageChange}
              selectedIds={selectedIds}
              onSelect={handleSelect}
              onSelectAll={handleSelectAll}
              loading={isLoading}
            />
          </div>
        </div>
      </Content.Full>
    </ContentLayout>
  );
};

export default TaskWorkPage;
