/*
 * path           : app/groupware/(member)/sys/emp
 * fileName       : page.jsx
 * author         : 이승진
 * date           : 25.11.03
 * description    :
 * ===========================================================
 * DATE              AUTHOR        NOTE
 * -----------------------------------------------------------
 * 25.11.03        이승진       최초 생성
 */
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useApi } from '@/shared/hooks';

import {
  EmpList,
  EmpSearch,
  EmpDetail,
  InitPasswordSetModal,
  empApi,
  EMP_CONSTANTS,
  EmpListEntity,
  Emp
} from '@/features/groupware/sys/emp';
import { Content, ContentLayout, Button, Drawer } from '@/shared/component';
import { createDynamicPath } from '@/shared/lib';
import { useAlertStore } from '@/shared/store';

//공통디자인 scss
import styles from '@/shared/component/layout/layout.module.scss';

const EmpPage = function () {
  const router = useRouter();
  const urlSearchParams = useSearchParams();

  // URL에서 선택된 직원 ID 파싱
  const selectedEmpId = useMemo(
    function () {
      const viewId = urlSearchParams.get('view');
      return viewId ? Number(viewId) : null;
    },
    [urlSearchParams]
  );

  // 검색 파라미터 (useState lazy initialization)
  const [searchParams, setSearchParams] = useState(function () {
    if (typeof window === 'undefined') {
      return {
        page: 1,
        size: EMP_CONSTANTS.DEFAULT_PAGE_SIZE,
        empType: '',
        searchKeyword: ''
      };
    }
    try {
      const saved = sessionStorage.getItem('sys_emp_search_state');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          page: parsed.page || 1,
          size: EMP_CONSTANTS.DEFAULT_PAGE_SIZE,
          empType: parsed.empType || '',
          searchKeyword: parsed.searchKeyword || ''
        };
      }
    } catch {
      // 파싱 실패 시 기본값
    }
    return {
      page: 1,
      size: EMP_CONSTANTS.DEFAULT_PAGE_SIZE,
      empType: '',
      searchKeyword: ''
    };
  });

  const [searchInput, setSearchInput] = useState(function () {
    if (typeof window === 'undefined') {
      return { empType: '', searchKeyword: '' };
    }
    try {
      const saved = sessionStorage.getItem('sys_emp_search_state');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          empType: parsed.empType || '',
          searchKeyword: parsed.searchKeyword || ''
        };
      }
    } catch {
      // 파싱 실패 시 기본값
    }
    return { empType: '', searchKeyword: '' };
  });

  // 검색 실행 여부
  const [hasSearched, setHasSearched] = useState(function () {
    if (typeof window === 'undefined') return false;
    try {
      const saved = sessionStorage.getItem('sys_emp_search_state');
      return !!saved;
    } catch {
      return false;
    }
  });

  // useApi 훅으로 데이터 페칭 (자동 상태 관리)
  const {
    data: result,
    has,
    isLoading,
    error
  } = useApi(
    hasSearched
      ? () =>
          empApi.getList({
            page: searchParams.page || 1,
            size: searchParams.size || 10,
            empTy: searchParams.empType || undefined,
            searchKeyword: searchParams.searchKeyword || undefined,
            searchType: searchParams.searchKeyword ? 'name' : undefined
          })
      : null,
    [searchParams, hasSearched]
  );

  // 검색 상태를 sessionStorage에 저장하는 함수
  const saveSearchState = function (state) {
    if (typeof window === 'undefined') return;
    try {
      sessionStorage.setItem('sys_emp_search_state', JSON.stringify(state));
    } catch {
      // sessionStorage 사용 불가 시 무시
    }
  };

  // 페이지 복귀 시 sessionStorage에서 상태 복원
  useEffect(
    function () {
      if (typeof window === 'undefined') return;

      try {
        const saved = sessionStorage.getItem('sys_emp_search_state');
        if (saved) {
          const parsed = JSON.parse(saved);

          // 현재 상태와 다르면 복원
          const shouldRestore =
            !hasSearched ||
            parsed.page !== searchParams.page ||
            parsed.empType !== searchParams.empType ||
            parsed.searchKeyword !== searchParams.searchKeyword;

          if (shouldRestore) {
            setSearchParams({
              page: parsed.page || 1,
              size: EMP_CONSTANTS.DEFAULT_PAGE_SIZE,
              empType: parsed.empType || '',
              searchKeyword: parsed.searchKeyword || ''
            });
            setSearchInput({
              empType: parsed.empType || '',
              searchKeyword: parsed.searchKeyword || ''
            });
            setHasSearched(true);
          }
        }
      } catch {
        // sessionStorage 읽기 실패 시 무시
      }
    },
    [] // 마운트 시에만 실행
  );

  // 엔티티 변환
  const empData = result
    ? EmpListEntity.fromApi(result)
    : { list: [], pagination: { currentPage: 1, totalPages: 1, pageSize: 10, totalCount: 0 } };

  // 선택된 직원 목록
  const [selectedEmps, setSelectedEmps] = useState([]);

  // 드로워 상태
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState(null);

  // 초기 비밀번호 설정 모달 상태
  const [isInitPasswordModalOpen, setIsInitPasswordModalOpen] = useState(false);
  const [isInitPasswordSubmitting, setIsInitPasswordSubmitting] = useState(false);

  // URL 상태 업데이트
  const updateUrlView = function (empId) {
    const params = new URLSearchParams(urlSearchParams);
    if (empId) {
      params.set('view', empId);
    } else {
      params.delete('view');
    }
    router.push(`${createDynamicPath('/sys/emp')}?${params.toString()}`);
  };

  // 직원 삭제
  const handleDelete = async function (empNo) {
    const success = await empApi.delete(empNo);

    if (success) {
      setSearchParams({ ...searchParams });
      updateUrlView(null);
    }
  };

  /**
   * 초기 비밀번호 설정 버튼 클릭 핸들러
   */
  const handleOpenInitPasswordModal = function () {
    setIsInitPasswordModalOpen(true);
  };

  /**
   * 초기 비밀번호 설정 제출 핸들러
   */
  const handleInitPasswordSubmit = async function (password) {
    setIsInitPasswordSubmitting(true);

    try {
      const success = await empApi.setTenantInitPassword(password);

      if (success) {
        setIsInitPasswordModalOpen(false);
        const { showSuccess } = useAlertStore.getState();
        showSuccess({
          title: '설정 완료',
          message: '초기 비밀번호가 설정되었습니다.',
          onClose: () => {
            // 필요 시 데이터 새로고침
          }
        });
      }
    } finally {
      setIsInitPasswordSubmitting(false);
    }
  };

  // 검색 핸들러 (조회 버튼)
  const handleSearch = function () {
    setHasSearched(true);
    const newParams = {
      ...searchParams,
      page: 1,
      empType: searchInput.empType,
      searchKeyword: searchInput.searchKeyword
    };
    setSearchParams(newParams);
    setSelectedEmps([]);

    // sessionStorage에 검색 조건 저장
    saveSearchState(newParams);
  };

  // 초기화 핸들러 (조회조건만 초기화, 재조회 안함)
  const handleReset = function () {
    setSearchInput({
      empType: '',
      searchKeyword: ''
    });
    setHasSearched(false);
    // sessionStorage 초기화
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('sys_emp_search_state');
    }
  };

  const handlePageChange = function (newPage) {
    const newParams = { ...searchParams, page: newPage };
    setSearchParams(newParams);

    // sessionStorage 페이지 번호 업데이트
    saveSearchState(newParams);
  };

  const handleRowClick = function (row) {
    if (row && row.empNo) {
      router.push(createDynamicPath(`/sys/emp/edit?id=${row.empNo}`));
    }
  };

  // 선택된 직원들 삭제
  const handleBulkDelete = function () {
    if (selectedEmps.length === 0) {
      const { showError } = useAlertStore.getState();
      showError({
        title: '알림',
        message: '삭제할 직원을 선택해주세요.'
      });
      return;
    }

    const { showConfirm } = useAlertStore.getState();
    showConfirm({
      title: '직원 삭제',
      message: `선택한 ${selectedEmps.length}명의 직원을 삭제하시겠습니까?`,
      onConfirm: async function () {
        for (const empNo of selectedEmps) {
          await handleDelete(empNo);
        }
        setSelectedEmps([]);
      },
      variant: 'warning',
      confirmText: '삭제',
      cancelText: '취소'
    });
  };

  // 선택된 직원들 비밀번호 초기화
  /**
   * 비밀번호 초기화 (일괄 처리)
   */
  const handleBulkResetPassword = async function () {
    if (selectedEmps.length === 0) {
      const { showWarning } = useAlertStore.getState();
      showWarning({
        title: '선택 오류',
        message: '비밀번호를 초기화할 직원을 선택해주세요.'
      });
      return;
    }

    // 초기 비밀번호 설정 여부 확인
    const { data: initPwdData } = await empApi.getTenantInitPassword();

    if (!initPwdData || initPwdData.hasInitPassword !== 'true') {
      const { showConfirm } = useAlertStore.getState();
      showConfirm({
        title: '초기 비밀번호 미설정',
        message: '초기 비밀번호가 설정되지 않았습니다.\n먼저 초기 비밀번호를 설정하시겠습니까?',
        variant: 'warning',
        confirmText: '설정하기',
        cancelText: '취소',
        onConfirm: () => {
          // 초기 비밀번호 설정 모달 열기
          setIsInitPasswordModalOpen(true);
        }
      });
      return;
    }

    // 확인 다이얼로그
    const { showConfirm } = useAlertStore.getState();
    showConfirm({
      title: '비밀번호 초기화',
      message: `선택한 ${selectedEmps.length}명의 비밀번호를 초기화하시겠습니까?\n테넌트의 초기 비밀번호로 자동 설정됩니다.`,
      variant: 'warning',
      confirmText: '초기화',
      cancelText: '취소',
      onConfirm: async () => {
        await executePasswordReset();
      }
    });
  };

  /**
   * 비밀번호 초기화 실행
   */
  const executePasswordReset = async function () {
    let successCount = 0;
    let failCount = 0;

    for (const empNo of selectedEmps) {
      try {
        const success = await empApi.resetPassword(empNo);
        if (success) {
          successCount++;
        } else {
          failCount++;
        }
      } catch (error) {
        failCount++;
      }
    }

    // 결과 알림
    const { showSuccess, showWarning } = useAlertStore.getState();
    if (failCount === 0) {
      showSuccess({
        title: '초기화 완료',
        message: `${successCount}명의 비밀번호가 초기화되었습니다.`,
        onClose: () => {
          setSelectedEmps([]);
        }
      });
    } else {
      showWarning({
        title: '초기화 완료',
        message: `성공: ${successCount}명, 실패: ${failCount}명`
      });
    }
  };

  // 체크박스 선택 핸들러
  const handleSelectEmp = function (empNo) {
    setSelectedEmps((prev) => {
      if (prev.includes(empNo)) {
        return prev.filter((no) => no !== empNo);
      } else {
        return [...prev, empNo];
      }
    });
  };

  // 전체 선택/해제
  const handleSelectAll = function () {
    if (selectedEmps.length === empData.list.length) {
      setSelectedEmps([]);
    } else {
      setSelectedEmps(empData.list.map((emp) => emp.empNo));
    }
  };

  const handleCloseDetailDrawer = function () {
    updateUrlView(null);
    setIsDetailDrawerOpen(false);
    setSelectedEmp(null);
  };

  // 테이블 컬럼 정의
  const columns = [
    { key: 'usrNm', label: '직원명' },
    { key: 'deptNm', label: '부서' },
    { key: 'usrTel', label: '연락처' },
    { key: 'email', label: '이메일' },
    { key: 'usrRole', label: '회원권한' },
    { key: 'empStatus', label: '재직상태' },
    { key: 'empType', label: '계약구분' },
    { key: 'posNm', label: '직급' }
  ];

  const tableData = empData.list.map(function (item, index) {
    const rowNumber =
      empData.pagination?.currentPage && empData.pagination?.pageSize
        ? (empData.pagination.currentPage - 1) * empData.pagination.pageSize + index + 1
        : index + 1;

    return Emp.toTableRow(item, rowNumber);
  });

  return (
    <ContentLayout>
      <ContentLayout.Header title="직원 관리" subtitle="직원 정보 조회 및 관리">
        <Button variant="secondary" onClick={handleReset}>
          초기화
        </Button>
        <Button variant="primary" onClick={handleSearch}>
          조회
        </Button>
      </ContentLayout.Header>

      <Content.Full>
        {/* <div className={styles.empList}> */}
        <div className={styles.boardWrap}>
          {/* 검색 영역 */}
          <EmpSearch
            empType={searchInput.empType}
            searchKeyword={searchInput.searchKeyword}
            onEmpTypeChange={function (value) {
              setSearchInput({ ...searchInput, empType: value });
            }}
            onSearchChange={function (e) {
              setSearchInput({ ...searchInput, searchKeyword: e.target.value });
            }}
            onSearch={handleSearch}
          />

          <div className={`${styles.hasTbBtn}`}>
            {/* 액션 버튼 영역 */}
            <div className={`${styles.tbBtnArea} ${styles.tbBtnAreaFull}`}>
              <Button
                variant="primary"
                onClick={function () {
                  router.push(createDynamicPath('/sys/emp/write'));
                }}
              >
                등록
              </Button>
              <Button variant="secondary" onClick={handleBulkResetPassword}>
                비밀번호 초기화
              </Button>
              <Button variant="secondary" onClick={handleOpenInitPasswordModal}>
                비밀번호 설정
              </Button>
              <Button variant="danger" onClick={handleBulkDelete}>
                삭제
              </Button>
            </div>

            {/* 테이블 + 페이지네이션 */}
            <EmpList
              columns={columns}
              data={tableData}
              pagination={empData.pagination}
              onRowClick={handleRowClick}
              onPageChange={handlePageChange}
              loading={isLoading}
              selectedEmps={selectedEmps}
              onSelectEmp={handleSelectEmp}
              onSelectAll={handleSelectAll}
            />
          </div>
        </div>
      </Content.Full>

      {/* 상세보기 Drawer */}
      <Drawer isOpen={isDetailDrawerOpen} onClose={handleCloseDetailDrawer} title="직원 상세 정보">
        {selectedEmp && <EmpDetail emp={selectedEmp} />}
      </Drawer>

      {/* 초기 비밀번호 설정 모달 */}
      <InitPasswordSetModal
        isOpen={isInitPasswordModalOpen}
        onSubmit={handleInitPasswordSubmit}
        onClose={() => setIsInitPasswordModalOpen(false)}
        isSubmitting={isInitPasswordSubmitting}
      />
    </ContentLayout>
  );
};

export default EmpPage;
