'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { format, subMonths } from 'date-fns';
import { equipApi, SurveyForm, DeleteSurveyForm, SurveySearch } from '@/features/equip';
import { DataTable, Pagination, Content, ContentLayout, Loading, Button, Modal } from '@/shared/component';
import { useAlertStore, useAuthStore } from '@/shared/store';
import layoutStyles from '@/shared/component/layout/layout.module.scss';
import modalStyles from '@/features/equip/ui/equip-modal.module.scss';

export default function SurveyManagePage() {
  const router = useRouter();
  const { showSuccess, showError, showConfirm } = useAlertStore();
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [surveyData, setSurveyData] = useState({ list: [], pagination: {} });
  const [allSurveys, setAllSurveys] = useState([]); // 전체 실사 목록 상태 추가

  // 초기값 설정 함수
  const getInitialFilters = () => {
    const endDate = new Date();
    const startDate = subMonths(endDate, 1);
    return {
      survDesc: '',
      isCompleted: 'all',
      survStaDt: startDate,
      survEndDt: endDate,
      periodType: '1M'
    };
  };

  const [searchFilters, setSearchFilters] = useState(getInitialFilters());
  const [searchParams, setSearchParams] = useState({ page: 1, size: 10, ...getInitialFilters() });

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState(null);

  const formRef = useRef(null);
  const deleteFormRef = useRef(null);

  const hasPermission = user && ['ADM', 'SYSADM'].includes(user.usrRole);

  const fetchSurveyList = async () => {
    if (!hasPermission) return;
    setLoading(true);
    const paramsForApi = { ...searchParams };

    // 날짜 포맷팅 (항상 new Date()로 감싸서 안전하게 처리)
    if (paramsForApi.survStaDt) paramsForApi.survStaDt = format(new Date(paramsForApi.survStaDt), 'yyyy-MM-dd');
    if (paramsForApi.survEndDt) paramsForApi.survEndDt = format(new Date(paramsForApi.survEndDt), 'yyyy-MM-dd');

    // isCompleted 변환 ('true' -> true, 'false' -> false)
    if (paramsForApi.isCompleted === 'true') paramsForApi.isCompleted = true;
    if (paramsForApi.isCompleted === 'false') paramsForApi.isCompleted = false;

    // 빈 값 제거 및 periodType 제거 (API에는 필요 없음)
    Object.keys(paramsForApi).forEach((key) => {
      if (
        paramsForApi[key] === 'all' ||
        paramsForApi[key] === '' ||
        paramsForApi[key] === null ||
        key === 'periodType'
      ) {
        delete paramsForApi[key];
      }
    });

    const result = await equipApi.getSurveyList({ params: paramsForApi });
    if (result && result.data) {
      setSurveyData({ list: result.data.content, pagination: { ...result.data, content: null } });
    } else {
      showError('실사 목록을 불러오는데 실패했습니다.');
    }
    setLoading(false);
  };

  // 전체 실사 목록 조회 (삭제 모달용)
  const fetchAllSurveys = async () => {
    const result = await equipApi.getSurveyList({ params: { page: 1, size: 1000 } }); // 충분히 큰 사이즈로 전체 조회
    if (result && result.data) {
      setAllSurveys(result.data.content || []);
    }
  };

  useEffect(() => {
    if (hasPermission) {
      fetchSurveyList();
    }
  }, [searchParams, hasPermission]);

  const handleFilterChange = (field, value) => {
    setSearchFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleSearch = () => {
    setSearchParams((prev) => ({ ...prev, page: 1, ...searchFilters }));
  };

  const handleClear = () => {
    setSearchFilters(getInitialFilters());
  };

  const handlePageChange = (page) => setSearchParams((prev) => ({ ...prev, page }));

  const openFormModal = (survey = null) => {
    setSelectedSurvey(survey);
    setIsFormModalOpen(true);
  };

  const openDeleteModal = () => {
    fetchAllSurveys(); // 모달 열 때 전체 목록 조회
    setIsDeleteModalOpen(true);
  };

  const closeFormModal = () => {
    setIsFormModalOpen(false);
    setSelectedSurvey(null);
  };

  const handleFormSubmit = async (formData) => {
    const dataToSend = {
      ...formData,
      survStaDt: formData.survStaDt ? format(formData.survStaDt, 'yyyy-MM-dd') : null,
      survEndDt: formData.survEndDt ? format(formData.survEndDt, 'yyyy-MM-dd') : null
    };

    const apiCall = selectedSurvey
      ? equipApi.updateSurvey(selectedSurvey.survId, dataToSend)
      : equipApi.createSurvey(dataToSend);

    const result = await apiCall;
    if (result) {
      showSuccess(selectedSurvey ? '실사 정보가 수정되었습니다.' : '신규 실사가 생성되었습니다.');
      closeFormModal();
      fetchSurveyList();
    } else {
      showError(selectedSurvey ? '실사 정보 수정에 실패했습니다.' : '신규 실사 생성에 실패했습니다.');
    }
  };

  const handleDeleteSurveySubmit = (survId) => {
    showConfirm({
      title: '실사 회차 삭제 확인',
      message: '정말로 선택한 실사 회차를 삭제하시겠습니까? 관련된 모든 데이터가 영구적으로 삭제됩니다.',
      variant: 'danger',
      onConfirm: async () => {
        const result = await equipApi.deleteSurvey(survId);
        if (result) {
          showSuccess('실사가 삭제되었습니다.');
          setIsDeleteModalOpen(false);
          fetchSurveyList();
        } else {
          showError('실사 회차 삭제에 실패했습니다.');
        }
      }
    });
  };

  const triggerFormSubmit = () => formRef.current?.submit();
  const triggerDeleteFormSubmit = () => deleteFormRef.current?.submit();

  const columns = [
    { key: 'survDesc', label: '실사명' },
    { key: 'survStaDt', label: '시작일' },
    { key: 'survEndDt', label: '종료일' },
    { key: 'totalCnt', label: '대상 자산' },
    { key: 'completedCnt', label: '완료 자산' }
  ];

  const renderers = {
    survStaDt: (value) => (value ? format(new Date(value), 'yyyy-MM-dd') : '-'),
    survEndDt: (value) => (value ? format(new Date(value), 'yyyy-MM-dd') : '-')
  };

  // 삭제 모달용 옵션 (전체 목록 사용)
  const deleteSurveyOptions = [
    { value: 'all', label: '전체' },
    ...allSurveys.map((s) => ({ value: s.survId, label: s.survDesc || `실사 #${s.survNo}` }))
  ];

  if (!hasPermission) {
    return <Loading message="권한이 없습니다." />;
  }

  return (
    <>
      <ContentLayout>
        <ContentLayout.Header title="실사 회차 관리" subtitle="실사 회차를 생성, 수정, 삭제합니다.">
          <Button variant="primary" onClick={handleSearch} disabled={loading}>
            조회
          </Button>
          <Button variant="secondary" onClick={handleClear} disabled={loading}>
            초기화
          </Button>
        </ContentLayout.Header>
        <Content.Full>
          <div className={layoutStyles.boardWrap}>
            {/* 검색 필터 영역: hasItem04 유지 (SurveySearch 내부 레이아웃 깨짐 방지) */}
            <div className={layoutStyles.hasItem04}>
              <SurveySearch searchFilters={searchFilters} onFilterChange={handleFilterChange} disabled={loading} />
            </div>

            {/* 테이블 및 버튼 영역: hasTbBtn으로 감싸서 간격 확보 및 PartnerPage 스타일 통일 */}
            <div className={layoutStyles.hasTbBtn}>
              <div className={`${layoutStyles.tbBtnArea} ${layoutStyles.tbBtnAreaFull}`}>
                <Button variant="primary" onClick={() => openFormModal()}>
                  + 신규 실사 생성
                </Button>
                <Button variant="danger" onClick={openDeleteModal}>
                  - 실사 회차 삭제
                </Button>
              </div>
              {loading ? (
                <Loading message="실사 목록을 불러오는 중..." />
              ) : (
                <DataTable
                  columns={columns}
                  data={surveyData.list}
                  keyField="survId"
                  renderers={renderers}
                  onRowClick={openFormModal}
                  emptyMessage="생성된 실사가 없습니다."
                />
              )}
              {/* Pagination을 hasTbBtn 내부로 포함 */}
              <Pagination
                currentPage={surveyData.pagination.number + 1}
                totalPages={surveyData.pagination.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        </Content.Full>
      </ContentLayout>

      {/* 생성/수정 모달 */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={closeFormModal}
        title={selectedSurvey ? '실사 정보 수정' : '신규 실사 생성'}
        onConfirm={triggerFormSubmit}
        confirmText={selectedSurvey ? '수정' : '생성'}
        cancelText="취소"
        variant="large"
        className={modalStyles.overflowVisibleModal}
      >
        <SurveyForm ref={formRef} initialData={selectedSurvey} onSubmit={handleFormSubmit} />
      </Modal>

      {/* 삭제 모달 */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="실사 회차 삭제"
        onConfirm={triggerDeleteFormSubmit}
        confirmText="삭제"
        cancelText="취소"
        variant="large"
        className={modalStyles.overflowVisibleModal}
      >
        <DeleteSurveyForm ref={deleteFormRef} onSubmit={handleDeleteSurveySubmit} surveyOptions={deleteSurveyOptions} />
      </Modal>
    </>
  );
}
