/*
 * path           : app/groupware/(member)/sys/tmpl
 * fileName       : page.jsx
 * author         : 이승진
 * date           : 25.11.17
 * description    :
 * ===========================================================
 * DATE              AUTHOR        NOTE
 * -----------------------------------------------------------
 * 25.11.17        이승진       최초 생성
 */
'use client';

import { useState } from 'react';
import { Content, ContentLayout, Button, Loading } from '@/shared/component';
import { TmplList, TmplFormDrawer, TmplSearch, tmplApi, TmplListEntity, Tmpl } from '@/features/groupware/sys/tmpl';
import { useAlertStore } from '@/shared/store';
import { useApi } from '@/shared/hooks';

//공통디자인 scss
import styles from '@/shared/component/layout/layout.module.scss';

/**
 * 템플릿 관리 페이지
 * @returns {JSX.Element}
 */
export default function TmplPage() {
  const [searchParams, setSearchParams] = useState({
    searchType: '',
    searchKeyword: '',
    useYn: '',
    page: 1,
    pageSize: 10
  });

  const [searchInput, setSearchInput] = useState({
    searchType: '',
    searchKeyword: '',
    useYn: ''
  });

  // Drawer 상태
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedTmpl, setSelectedTmpl] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // useApi 훅으로 데이터 페칭 (자동 상태 관리)
  const { data: result, isLoading } = useApi(() => tmplApi.getList(searchParams), [searchParams]);

  // 엔티티 변환
  const tmplData = result
    ? TmplListEntity.fromApi(result)
    : { list: [], pagination: { currentPage: 1, totalPages: 1, pageSize: 10, totalCount: 0 } };

  // 검색
  const handleSearch = function () {
    const newParams = {
      ...searchParams,
      ...searchInput,
      page: 1
    };

    // searchType이 'useYn'인 경우, useYn 파라미터를 searchKeyword 값으로 설정
    if (searchInput.searchType === 'useYn') {
      newParams.useYn = searchInput.searchKeyword;
    } else {
      // 다른 검색 타입일 때는 useYn 초기화
      newParams.useYn = '';
    }

    setSearchParams(newParams);
  };

  // 검색 조건 변경
  const handleSearchInputChange = function (params) {
    setSearchInput({
      ...searchInput,
      ...params
    });
  };

  // 페이지 변경
  const handlePageChange = function (newPage) {
    setSearchParams({ ...searchParams, page: newPage });
  };

  // 등록 버튼
  const handleCreate = function () {
    setSelectedTmpl(null);
    setIsEditMode(false);
    setIsDrawerOpen(true);
  };

  // 로우 클릭 (수정)
  const handleRowClick = async function (tmpl) {
    // 상세 정보 조회 (목록 API는 제목만 포함, 내용/비고는 상세 API에서 가져옴)
    const detailData = await tmplApi.get(tmpl.id);
    if (detailData) {
      const tmplEntity = Tmpl.fromApi(detailData);
      setSelectedTmpl(tmplEntity);
    } else {
      setSelectedTmpl(tmpl);
    }

    setIsEditMode(true);
    setIsDrawerOpen(true);
  };

  // 등록/수정 처리
  const handleSubmit = async function (formData) {
    const { showSuccess } = useAlertStore.getState();

    if (isEditMode) {
      const success = await tmplApi.update(selectedTmpl.id, formData);
      if (success) {
        // 목록 새로고침 - searchParams 변경으로 useApi 자동 호출
        setSearchParams({ ...searchParams });
        showSuccess('템플릿이 수정되었습니다.');
        return true;
      }
      return false;
    } else {
      const success = await tmplApi.create(formData);
      if (success) {
        // 목록 새로고침 - searchParams 변경으로 useApi 자동 호출
        setSearchParams({ ...searchParams });
        showSuccess('템플릿이 등록되었습니다.');
        return true;
      }
      return false;
    }
  };

  // 삭제 처리
  const handleDelete = async function (tmplId) {
    const { showSuccess } = useAlertStore.getState();

    const success = await tmplApi.delete(tmplId);
    if (success) {
      // 목록 새로고침 - searchParams 변경으로 useApi 자동 호출
      setSearchParams({ ...searchParams });
      showSuccess('템플릿이 삭제되었습니다.');
    }
  };

  const tableData = tmplData.list.map(function (item, index) {
    const rowNumber = (searchParams.page - 1) * searchParams.pageSize + index + 1;
    return Tmpl.toTableRow(item, rowNumber);
  });

  return (
    <ContentLayout>
      <ContentLayout.Header title="템플릿 관리" subtitle="템플릿 조회 및 관리">
        <Button variant="primary" onClick={handleSearch}>
          조회
        </Button>
      </ContentLayout.Header>

      <Content.Full>
        <div className={styles.boardWrap}>
          {/* 검색 영역 */}
          <TmplSearch value={searchInput} onChange={handleSearchInputChange} onSearch={handleSearch} />

          <div className={`${styles.hasTbBtn}`}>
            {/* 액션 버튼 영역 */}
            <div className={`${styles.tbBtnArea} ${styles.tbBtnAreaFull}`}>
              <Button variant="primary" onClick={handleCreate}>
                등록
              </Button>
            </div>

            {/* 목록 */}
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loading message="로딩 중..." />
              </div>
            ) : (
              <TmplList
                data={tableData}
                pagination={tmplData.pagination}
                onRowClick={handleRowClick}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </div>
      </Content.Full>

      {/* 등록/수정 Drawer */}
      <TmplFormDrawer
        isOpen={isDrawerOpen}
        onClose={function () {
          setIsDrawerOpen(false);
        }}
        initialData={selectedTmpl}
        isEditMode={isEditMode}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
      />
    </ContentLayout>
  );
}
