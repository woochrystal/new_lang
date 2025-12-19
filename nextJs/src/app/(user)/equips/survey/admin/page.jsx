'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { equipApi, SurveyCheckSearch } from '@/features/equip';
import { DataTable, Pagination, Content, ContentLayout, Loading, Button, Tag } from '@/shared/component';
import { useAlertStore, useAuthStore } from '@/shared/store';
import { EQUIP_STATUS_OPTIONS, SURVEY_STATUS_OPTIONS } from '@/features/equip/script/constants';
import layoutStyles from '@/shared/component/layout/layout.module.scss';

const codeToLabel = (options) => {
  return options.reduce((acc, option) => {
    acc[option.value] = option.label;
    return acc;
  }, {});
};

const STATUS_LABELS = codeToLabel(EQUIP_STATUS_OPTIONS);

export default function SurveyStatusPage() {
  const router = useRouter();
  const { showError } = useAlertStore();
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuthStore();

  const [loading, setLoading] = useState({ list: false, surveys: true });
  const [surveyRounds, setSurveyRounds] = useState([]);
  const [checkData, setCheckData] = useState({ list: [], pagination: {} });
  const [searchFilters, setSearchFilters] = useState({ survId: 'all', survChkYn: 'all', usrNm: '', eqpNm: '' });
  const [searchParams, setSearchParams] = useState(null); // 초기에는 null로 설정

  useEffect(() => {
    if (!isAuthLoading && user && !['ADM', 'SYSADM'].includes(user.usrRole)) {
      showError('이 페이지에 접근할 권한이 없습니다.');
      router.replace('/');
    }
  }, [user, isAuthLoading, router, showError]);

  const hasPermission = user && ['ADM', 'SYSADM'].includes(user.usrRole);

  const fetchSurveyRounds = async () => {
    setLoading((prev) => ({ ...prev, surveys: true }));
    const result = await equipApi.getSurveyList({ params: { page: 1, size: 1000 } });
    if (result && result.data) {
      setSurveyRounds(result.data.content || []);
    } else {
      showError('실사 회차 목록을 불러오는데 실패했습니다.');
    }
    setLoading((prev) => ({ ...prev, surveys: false }));
  };

  const fetchCheckList = async () => {
    if (!hasPermission || !searchParams) return; // searchParams가 null이면 API 호출 안 함
    setLoading((prev) => ({ ...prev, list: true }));
    const paramsForApi = { ...searchParams };
    Object.keys(paramsForApi).forEach((key) => {
      if (paramsForApi[key] === 'all' || paramsForApi[key] === '') {
        delete paramsForApi[key];
      }
    });

    const result = await equipApi.getAllSurveyChecks({ params: paramsForApi });
    if (result && result.data) {
      setCheckData({ list: result.data.content, pagination: { ...result.data, content: null } });
    } else {
      showError('실사 현황 목록을 불러오는데 실패했습니다.');
    }
    setLoading((prev) => ({ ...prev, list: false }));
  };

  useEffect(() => {
    if (hasPermission) {
      fetchSurveyRounds();
    }
  }, [hasPermission]);

  useEffect(() => {
    fetchCheckList();
  }, [searchParams, hasPermission]);

  const handleFilterChange = (field, value) => setSearchFilters((prev) => ({ ...prev, [field]: value }));
  const handleSearch = () => setSearchParams({ page: 1, size: 10, ...searchFilters });
  const handleClear = () => {
    const initialFilters = { survId: 'all', survChkYn: 'all', usrNm: '', eqpNm: '' };
    setSearchFilters(initialFilters);
  };
  const handlePageChange = (page) => setSearchParams((prev) => ({ ...prev, page }));

  const columns = [
    { key: 'assetNo', label: '자산번호' },
    { key: 'eqpNm', label: '자산명' },
    { key: 'eqpSt', label: '제출 상태' },
    { key: 'survChkYn', label: '실사 여부' },
    { key: 'note', label: '실사 비고' },
    { key: 'equipNote', label: '자산 비고' },
    { key: 'survChkDtm', label: '확인일' }
  ];

  const renderers = {
    eqpSt: (value) => {
      if (!value)
        return (
          <Tag variant="danger" size="txtOnly">
            이관(확인필요)
          </Tag>
        );
      return STATUS_LABELS[value] || value;
    },
    survChkYn: (value) =>
      value === 'Y' ? (
        <Tag variant="success" size="txtOnly">
          완료
        </Tag>
      ) : (
        <Tag variant="info" size="txtOnly">
          미완료
        </Tag>
      ),
    note: (value) => value || '-',
    equipNote: (value) => value || '-',
    survChkDtm: (value) => (value ? format(new Date(value), 'yyyy-MM-dd') : '-')
  };

  const surveyOptions = [
    { value: 'all', label: '전체' },
    ...(Array.isArray(surveyRounds)
      ? surveyRounds.map((s) => ({ value: s.survId, label: s.survDesc || `실사 #${s.survNo}` }))
      : [])
  ];

  if (!hasPermission) {
    return <Loading message="권한이 없습니다." />;
  }

  return (
    <>
      <ContentLayout>
        <ContentLayout.Header title="실사 현황" subtitle="전체 실사 현황을 자산 기준으로 검색하고 조회합니다.">
          <Button variant="primary" onClick={handleSearch} disabled={loading.list || loading.surveys}>
            조회
          </Button>
          <Button variant="secondary" onClick={handleClear} disabled={loading.list || loading.surveys}>
            초기화
          </Button>
        </ContentLayout.Header>
        <Content.Full>
          <div className={layoutStyles.boardWrap}>
            <div className={layoutStyles.hasItem04}>
              <SurveyCheckSearch
                searchFilters={searchFilters}
                onFilterChange={handleFilterChange}
                onSearch={handleSearch}
                disabled={loading.list || loading.surveys}
                surveyOptions={surveyOptions}
                showFields={['survId', 'survChkYn', 'usrNm', 'eqpNm']}
              />
            </div>
            <div className={layoutStyles.hasTbBtn}>
              {loading.list ? (
                <Loading message="실사 현황을 불러오는 중..." />
              ) : (
                <DataTable
                  columns={columns}
                  data={checkData.list}
                  keyField="survChkId"
                  renderers={renderers}
                  emptyMessage={searchParams ? '검색 결과가 없습니다.' : '검색 버튼을 눌러 실사 현황을 조회하세요.'}
                />
              )}
            </div>
            {checkData.list.length > 0 && (
              <Pagination
                currentPage={checkData.pagination.number + 1}
                totalPages={checkData.pagination.totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </Content.Full>
      </ContentLayout>
    </>
  );
}
