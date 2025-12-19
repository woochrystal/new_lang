'use client';

import { useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import {
  BoardDetail,
  ExampleSearch,
  ExampleList,
  sampleApi,
  BOARD_CONSTANTS,
  BoardList,
  Board
} from '@/features/example';
import { Content, ContentLayout, Button, Drawer } from '@/shared/component';
import { useApi } from '@/shared/hooks';
import { createDynamicPath } from '@/shared/lib';
import { useAlertStore } from '@/shared/store';

//공통디자인 scss
import styles from '@/shared/component/layout/layout.module.scss';

//특정 스타일 추가 할 경우에만 별도 scss 파일 추가해서 수정해주세요
import pageStyles from './page.module.scss';

const ExamplePage = function () {
  const router = useRouter();
  const urlSearchParams = useSearchParams();

  // URL에서 선택된 게시글 ID 파싱
  const selectedBoardId = useMemo(
    function () {
      const viewId = urlSearchParams.get('view');
      return viewId ? Number(viewId) : null;
    },
    [urlSearchParams]
  );

  // 검색 상태
  const [searchParams, setSearchParams] = useState({
    page: 1,
    size: BOARD_CONSTANTS.DEFAULT_PAGE_SIZE,
    searchKeyword: ''
  });
  const [searchInput, setSearchInput] = useState('');

  // URL 상태 업데이트
  const updateUrlView = function (boardId) {
    const params = new URLSearchParams(urlSearchParams);
    if (boardId) {
      params.set('view', boardId);
    } else {
      params.delete('view');
    }
    router.push(`${createDynamicPath('/example')}?${params.toString()}`);
  };

  // 게시판 목록 로드
  const {
    data: result,
    has,
    isLoading,
    error
  } = useApi(
    () =>
      sampleApi.getList({
        page: searchParams.page || 1,
        size: searchParams.size || 10,
        searchKeyword: searchParams.searchKeyword
      }),
    [searchParams]
  );

  const boardData = result
    ? BoardList.fromApi(result)
    : { list: [], pagination: { currentPage: 1, totalPages: 1, pageSize: 10, totalCount: 0 } };

  const handleDelete = async function (boardId) {
    const success = await sampleApi.delete(boardId);

    if (success) {
      // 목록 새로고침 - searchParams 변경으로 useApi 자동 호출
      setSearchParams({ ...searchParams });
    }
  };

  // 이벤트 핸들러 - 검색
  const handleSearch = function () {
    const keyword = searchInput.trim();
    setSearchParams({ ...searchParams, page: 1, searchKeyword: keyword });
  };

  const handleClearSearch = function () {
    setSearchInput('');
    setSearchParams({ ...searchParams, page: 1, searchKeyword: '' });
  };

  const handlePageChange = function (newPage) {
    setSearchParams({ ...searchParams, page: newPage });
  };

  const handleRowClick = function (row) {
    if (row?.id) {
      updateUrlView(row.id);
    }
  };

  const handleEdit = function (boardId) {
    router.push(createDynamicPath(`/example/edit?id=${boardId}`));
  };

  const confirmDelete = function (boardId, event) {
    event.stopPropagation();
    const { showConfirm } = useAlertStore.getState();
    showConfirm({
      title: '게시글 삭제',
      message: '정말로 이 게시글을 삭제하시겠습니까?',
      onConfirm: function () {
        return handleDelete(boardId);
      },
      variant: 'warning',
      confirmText: '삭제',
      cancelText: '취소'
    });
  };

  const handleCloseDetailDrawer = function () {
    updateUrlView(null);
  };

  // 테이블 데이터 변환
  const columns = [
    { key: 'rowNumber', label: '번호' },
    { key: 'title', label: '제목' },
    { key: 'createdAt', label: '작성일' },
    { key: 'actions', label: '작업' }
  ];

  const tableData = boardData.list.map(function (item, index) {
    const rowNumber =
      boardData.pagination?.currentPage && boardData.pagination?.pageSize
        ? (boardData.pagination.currentPage - 1) * boardData.pagination.pageSize + index + 1
        : index + 1;

    return Board.toTableRow(item, rowNumber);
  });

  return (
    <ContentLayout>
      <ContentLayout.Header title="게시판 API 예제" subtitle="백엔드 API와 연동된 샘플 게시판 시스템">
        {has('write') && (
          <Button
            variant="primary"
            onClick={function () {
              router.push(createDynamicPath('/example/write'));
            }}
          >
            글쓰기
          </Button>
        )}
      </ContentLayout.Header>

      <Content.Full>
        <div className={styles.boardWrap}>
          <div className={styles.hasItem03}>
            {/* 검색 영역 */}
            <ExampleSearch
              value={searchInput}
              onChange={function (e) {
                setSearchInput(e.target.value);
              }}
              onSearch={handleSearch}
              onClear={handleClearSearch}
              placeholder="제목으로 검색..."
              disabled={isLoading}
            />
            {/* 검색 영역 */}
            <ExampleSearch
              value={searchInput}
              onChange={function (e) {
                setSearchInput(e.target.value);
              }}
              onSearch={handleSearch}
              onClear={handleClearSearch}
              placeholder="제목으로 검색..."
              disabled={isLoading}
            />
            {/* 검색 영역 */}
            <ExampleSearch
              value={searchInput}
              onChange={function (e) {
                setSearchInput(e.target.value);
              }}
              onSearch={handleSearch}
              onClear={handleClearSearch}
              placeholder="제목으로 검색..."
              disabled={isLoading}
            />
          </div>

          {/* 테이블 + 페이지네이션 */}
          <ExampleList
            columns={columns}
            data={tableData}
            pagination={boardData.pagination}
            onRowClick={handleRowClick}
            onEdit={handleEdit}
            onDelete={confirmDelete}
            onPageChange={handlePageChange}
            loading={isLoading}
            has={has}
          />
        </div>
      </Content.Full>

      {/* 상세보기 Drawer */}
      <Drawer isOpen={!!selectedBoardId} onClose={handleCloseDetailDrawer} title="게시글 상세">
        {selectedBoardId && (
          <BoardDetail boardId={selectedBoardId} onBack={handleCloseDetailDrawer} onDelete={handleCloseDetailDrawer} />
        )}
      </Drawer>
    </ContentLayout>
  );
};

export default ExamplePage;
