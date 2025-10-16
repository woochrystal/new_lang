'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { BoardList, BoardDetail, BoardSearch } from '@/features/example';
import Content from '@/shared/ui/Layout/Content';
import Alert from '@/shared/ui/Popup/Alert';
import Drawer from '@/shared/ui/Popup/Drawer';
import Button from '@/shared/ui/Button/Button';
import { EnhancedErrorHandler } from '@/features/example/script/errorHandler';
import { sampleApi } from '@/features/example/script/sampleApi';
import { BOARD_CONSTANTS } from '@/features/example/script/constants';
import { createDefaultSearchParams } from '@/features/example/script/utils';
import { LoggerFactory } from '@/shared/lib/logger';
import { createDynamicPath } from '@/shared/lib/routing';

const logger = LoggerFactory.getLogger('ExamplePage');

// ============================================================================
// Utils / Helpers (순수 함수)
// ============================================================================

const transformBoardItem = (item, index, result) => ({
  id: item.smpId,
  smpId: item.smpId,
  title: item.title || `게시글 ${item.smpId}`,
  content: item.content || '',
  createdAt: item.regDtm || new Date().toISOString(),
  updatedAt: item.updDtm || item.regDtm || new Date().toISOString(),
  rowNumber: result ? (result.page - 1) * result.size + index + 1 : index + 1
});

const transformBoardList = (result) => ({
  success: true,
  list: result.list.map((item, index) => transformBoardItem(item, index, result)),
  pagination: {
    currentPage: result.page,
    pageSize: result.size,
    totalCount: result.totalCount,
    totalPages: result.totalPages,
    hasPrevious: result.page > 1,
    hasNext: result.page < result.totalPages
  },
  totalCount: result.totalCount
});

// ============================================================================
// API Methods (API 호출)
// ============================================================================

const createFetchList = (setAlertConfig, setLoading, setBoardData) => async (searchParams) => {
  setLoading(true);
  try {
    const result = await sampleApi.getList({
      page: searchParams.page || 1,
      size: searchParams.size || 10,
      searchKeyword: searchParams.searchKeyword
    });

    if (!result?.list || !Array.isArray(result.list)) {
      throw new Error('Invalid API response');
    }

    setBoardData(transformBoardList(result));
  } catch (error) {
    const errorInfo = EnhancedErrorHandler.handleApiError(error);
    setAlertConfig({
      isOpen: true,
      title: errorInfo.title,
      message: errorInfo.message,
      variant: 'error'
    });
    setBoardData({ list: [], pagination: null });
  } finally {
    setLoading(false);
  }
};

const createFetchDetail = (setAlertConfig, setDetailLoading, setSelectedBoardData) => async (boardId) => {
  setDetailLoading(true);
  try {
    const result = await sampleApi.get(boardId);
    if (!result) throw new Error('Invalid API response');

    setSelectedBoardData(transformBoardItem(result, 0, null));
  } catch (error) {
    const errorInfo = EnhancedErrorHandler.handleApiError(error);
    setAlertConfig({
      isOpen: true,
      title: errorInfo.title,
      message: errorInfo.message,
      variant: 'error'
    });
  } finally {
    setDetailLoading(false);
  }
};

// ============================================================================
// Event Handlers (이벤트 핸들러)
// ============================================================================

const createUrlViewUpdater = (router, urlSearchParams) => (boardId) => {
  const params = new URLSearchParams(urlSearchParams);
  if (boardId) {
    params.set('view', boardId);
  } else {
    params.delete('view');
  }
  router.push(`${createDynamicPath('/example')}?${params.toString()}`);
};

const createSearchHandlers = (searchParams, setSearchParams) => ({
  handleSearch: (searchKeyword) => {
    setSearchParams({ ...searchParams, page: 1, searchKeyword: searchKeyword.trim() });
  },
  handleClearSearch: () => {
    setSearchParams({ ...searchParams, page: 1, searchKeyword: '' });
  },
  handlePageChange: (newPage) => {
    setSearchParams({ ...searchParams, page: newPage });
  },
  refreshList: () => {
    setSearchParams({ ...searchParams });
  }
});

// ============================================================================
// Component
// ============================================================================

export default function ExamplePage() {
  const router = useRouter();
  const urlSearchParams = useSearchParams();
  const viewId = urlSearchParams.get('view');

  const [loading, setLoading] = useState(true);
  const [boardData, setBoardData] = useState({ list: [], pagination: null });
  const [searchParams, setSearchParams] = useState(() =>
    createDefaultSearchParams({ size: BOARD_CONSTANTS.DEFAULT_PAGE_SIZE })
  );

  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(!!viewId);
  const [selectedBoardId, setSelectedBoardId] = useState(viewId ? Number(viewId) : null);
  const [selectedBoardData, setSelectedBoardData] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    variant: 'error'
  });

  // 핸들러 생성
  const updateUrlView = createUrlViewUpdater(router, urlSearchParams);
  const { handleSearch, handleClearSearch, handlePageChange, refreshList } = createSearchHandlers(
    searchParams,
    setSearchParams
  );
  const fetchList = createFetchList(setAlertConfig, setLoading, setBoardData);
  const fetchDetail = createFetchDetail(setAlertConfig, setDetailLoading, setSelectedBoardData);

  const handleBoardSelect = (boardData) => {
    if (!boardData?.id) {
      setAlertConfig({
        isOpen: true,
        title: '선택 오류',
        message: '잘못된 게시글 데이터입니다.',
        variant: 'error'
      });
      return;
    }
    updateUrlView(boardData.id);
  };

  const handleCloseDetailDrawer = () => updateUrlView(null);
  const closeAlert = () => {
    setAlertConfig((prev) => ({ ...prev, isOpen: false }));
  };

  // 게시판 목록 로드
  useEffect(() => {
    void fetchList(searchParams);
  }, [searchParams]);

  // 상세보기 로드
  useEffect(() => {
    const viewId = urlSearchParams.get('view');

    if (!viewId) {
      setIsDetailDrawerOpen(false);
      setSelectedBoardId(null);
      setSelectedBoardData(null);
      return;
    }

    const boardId = Number(viewId);
    setSelectedBoardId(boardId);
    setIsDetailDrawerOpen(true);

    if (boardId) void fetchDetail(boardId);
  }, [urlSearchParams]);

  return (
    <>
      <Content.PageHeader title="게시판 API 예제" subtitle="백엔드 API와 연동된 샘플 게시판 시스템">
        <Button variant="primary" onClick={() => router.push(createDynamicPath('/example/write'))}>
          글쓰기
        </Button>
        <Button variant="secondary" onClick={refreshList}>
          새로고침
        </Button>
      </Content.PageHeader>

      <Content.Full className="flex flex-col gap-4 pt-10">
        <BoardSearch
          onSearch={handleSearch}
          onClear={handleClearSearch}
          searchKeyword={searchParams.searchKeyword || ''}
          loading={loading}
        />

        <BoardList
          onBoardSelect={handleBoardSelect}
          showActions={true}
          boardData={boardData}
          loading={loading}
          onPageChange={handlePageChange}
          onRefresh={refreshList}
        />
      </Content.Full>

      <Drawer isOpen={isDetailDrawerOpen} onClose={handleCloseDetailDrawer} title="게시글 상세">
        {selectedBoardId ? (
          <BoardDetail
            boardId={selectedBoardId}
            initialBoardData={selectedBoardData}
            loading={detailLoading}
            onBack={handleCloseDetailDrawer}
          />
        ) : null}
      </Drawer>

      {alertConfig.isOpen ? (
        <Alert
          title={alertConfig.title}
          message={alertConfig.message}
          variant={alertConfig.variant}
          onClose={closeAlert}
        />
      ) : null}
    </>
  );
}
