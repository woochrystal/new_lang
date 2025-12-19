/*
 * path           : app/groupware/(member)/sys/vacCnt
 * fileName       : page.jsx
 * author         : 이승진
 * date           : 25.11.20
 * description    :
 * ===========================================================
 * DATE              AUTHOR        NOTE
 * -----------------------------------------------------------
 * 25.11.20        이승진       최초 생성
 */
'use client';

import { useState } from 'react';

import {
  VacCntList,
  VacCntSearch,
  VacCntForm,
  vacCntApi,
  VACCNT_CONSTANTS,
  VacCntListEntity,
  VacCnt,
  getYearOptions
} from '@/features/groupware/sys/vacCnt';
import { Content, ContentLayout, Article, Button, Alert, Input } from '@/shared/component';
import { useAlertStore } from '@/shared/store/alertStore';
import { useApi } from '@/shared/hooks';

//공통디자인 scss
import styles from '@/shared/component/layout/layout.module.scss';

const VacCntPage = function () {
  const [searchParams, setSearchParams] = useState({
    page: 1,
    size: VACCNT_CONSTANTS.DEFAULT_PAGE_SIZE,
    year: VACCNT_CONSTANTS.CURRENT_YEAR,
    empName: ''
  });
  const [searchInput, setSearchInput] = useState({
    year: VACCNT_CONSTANTS.CURRENT_YEAR,
    empName: ''
  });

  // useApi 훅으로 데이터 페칭 (자동 상태 관리)
  const { data: result, isLoading } = useApi(
    () =>
      vacCntApi.getList({
        page: searchParams.page || 1,
        size: searchParams.size || 10,
        year: searchParams.year,
        empName: searchParams.empName
      }),
    [searchParams]
  );

  // 엔티티 변환
  const vacCntData = result
    ? VacCntListEntity.fromApi(result)
    : { list: [], pagination: { currentPage: 1, totalPages: 1, pageSize: 10, totalCount: 0 } };

  // 드로워 상태 (수정 전용)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedVacCnt, setSelectedVacCnt] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 일괄 생성 Alert 상태
  const [showBatchInitializeAlert, setShowBatchInitializeAlert] = useState(false);
  const [batchInitializeYear, setBatchInitializeYear] = useState(VACCNT_CONSTANTS.CURRENT_YEAR);

  // 휴가일수 삭제
  const handleDelete = async function (id) {
    const success = await vacCntApi.delete(id);

    if (success) {
      const { showSuccess } = useAlertStore.getState();
      showSuccess('휴가일수 데이터가 삭제되었습니다.');
      // 목록 새로고침 - searchParams 변경으로 useApi 자동 호출
      setSearchParams({ ...searchParams });
    }
  };

  // 검색 핸들러
  const handleSearch = function () {
    setSearchParams({
      ...searchParams,
      page: 1,
      year: searchInput.year,
      empName: searchInput.empName
    });
  };

  const handleReset = function () {
    setSearchInput({
      year: VACCNT_CONSTANTS.CURRENT_YEAR,
      empName: ''
    });
  };

  const handlePageChange = function (newPage) {
    setSearchParams({ ...searchParams, page: newPage });
  };

  const handleRowClick = function (vacCntItem) {
    // List.jsx에서 이미 row.originalItem만 전달하므로, 받은 파라미터가 바로 데이터 객체
    if (vacCntItem) {
      setSelectedVacCnt(vacCntItem);
      setIsEditMode(true);
      setIsFormModalOpen(true);
    }
  };

  const confirmDelete = function (id) {
    const { showConfirm } = useAlertStore.getState();
    showConfirm({
      title: '휴가일수 삭제',
      message: '정말로 이 휴가일수 데이터를 삭제하시겠습니까?',
      onConfirm: function () {
        return handleDelete(id);
      },
      variant: 'warning',
      confirmText: '삭제',
      cancelText: '취소'
    });
  };

  const handleFormSubmit = async function (formData) {
    setIsSubmitting(true);

    try {
      if (isEditMode && selectedVacCnt) {
        const { data, error } = await vacCntApi.update(selectedVacCnt.id, formData);

        if (error) {
          console.error('[handleFormSubmit] 수정 실패:', error);
          return; // 에러는 defaultErrorHandler에 의해 GlobalErrorAlert에 표시됨
        }

        const { showSuccess } = useAlertStore.getState();
        showSuccess('휴가일수 데이터가 수정되었습니다.');
        setIsFormModalOpen(false);
        // 목록 새로고침 - searchParams 변경으로 useApi 자동 호출
        setSearchParams({ ...searchParams });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormClose = function () {
    setIsFormModalOpen(false);
    setSelectedVacCnt(null);
  };

  // 휴가일수 일괄 생성 버튼 클릭
  const handleBatchInitialize = function () {
    setBatchInitializeYear(searchInput.year || VACCNT_CONSTANTS.CURRENT_YEAR);
    setShowBatchInitializeAlert(true);
  };

  // 휴가일수 일괄 생성 확인
  const confirmBatchInitialize = async function () {
    setShowBatchInitializeAlert(false);

    const result = await vacCntApi.batchInitialize(batchInitializeYear);

    if (result) {
      const { showSuccess } = useAlertStore.getState();
      showSuccess(result.message || '휴가일수가 생성되었습니다.');
      // 목록 새로고침 - searchParams 변경으로 useApi 자동 호출
      setSearchParams({ ...searchParams });
    }
  };

  // 테이블 컬럼 정의
  const columns = [
    { key: 'rowNumber', label: '번호' },
    { key: 'empName', label: '직원명' },
    { key: 'year', label: '기준년도' },
    { key: 'usedVacationDays', label: '휴가 사용일' },
    { key: 'totalVacationDays', label: '총 휴가 일수' },
    { key: 'empStatus', label: '재직상태' },
    { key: 'empType', label: '계약구분' }
  ];

  const tableData = vacCntData.list.map(function (item, index) {
    const rowNumber =
      vacCntData.pagination?.currentPage && vacCntData.pagination?.pageSize
        ? (vacCntData.pagination.currentPage - 1) * vacCntData.pagination.pageSize + index + 1
        : index + 1;

    return VacCnt.toTableRow(item, rowNumber);
  });

  // 년도 옵션
  const yearOptions = getYearOptions();

  return (
    <ContentLayout>
      <ContentLayout.Header title="휴가 일수 관리" subtitle="직원별 휴가 일수 조회 및 관리">
        <Button variant="secondary" onClick={handleReset}>
          초기화
        </Button>
        <Button variant="primary" onClick={handleSearch}>
          조회
        </Button>
      </ContentLayout.Header>

      <Content.Full>
        <div className={styles.boardWrap}>
          {/* 검색 영역 */}
          <VacCntSearch
            year={searchInput.year}
            empName={searchInput.empName}
            onYearChange={function (value) {
              setSearchInput({ ...searchInput, year: value });
            }}
            onEmpNameChange={function (e) {
              setSearchInput({ ...searchInput, empName: e.target.value });
            }}
            onSearch={handleSearch}
            yearOptions={yearOptions}
          />

          <div className={`${styles.hasTbBtn}`}>
            {/* 액션 버튼 영역 */}
            <div className={`${styles.tbBtnArea} ${styles.tbBtnAreaFull}`}>
              <Button variant="secondary" onClick={handleBatchInitialize}>
                휴가일수 생성
              </Button>
            </div>

            {/* 테이블 + 페이지네이션 */}
            <VacCntList
              columns={columns}
              data={tableData}
              pagination={vacCntData.pagination}
              onRowClick={handleRowClick}
              onPageChange={handlePageChange}
              loading={isLoading}
            />
          </div>
        </div>
      </Content.Full>

      {/* 수정 Form Drawer */}
      <VacCntForm
        isOpen={isFormModalOpen}
        initialData={selectedVacCnt}
        onSubmit={handleFormSubmit}
        onClose={handleFormClose}
        isEditMode={isEditMode}
        yearOptions={yearOptions}
        isSubmitting={isSubmitting}
      />

      {/* 일괄 생성 확인 Alert */}
      {showBatchInitializeAlert && (
        <Alert
          message={`${batchInitializeYear}년도 전체 직원의 휴가일수를 생성하시겠습니까?`}
          variant="info"
          cancelText="취소"
          onConfirm={confirmBatchInitialize}
          onCancel={function () {
            setShowBatchInitializeAlert(false);
          }}
          onClose={function () {
            setShowBatchInitializeAlert(false);
          }}
        />
      )}
    </ContentLayout>
  );
};

export default VacCntPage;
