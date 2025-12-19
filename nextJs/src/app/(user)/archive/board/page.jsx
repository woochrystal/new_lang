/*
 * path           : app/groupware/(member)/archive/board
 * fileName       : page.jsx
 * author         : 박재민
 * date           : 25. 11. 3.
 * description    : 사용자용 게시글 목록 조회 페이지
 * ===========================================================
 * DATE              AUTHOR        NOTE
 * -----------------------------------------------------------
 * 25. 11. 3.        박재민       최초 생성
 * 25. 12. 2.        수정          레이아웃 개선
 */
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { boardApi, BoardListEntity, Board, BoardDetail, BoardList, RadioButton } from '@/features/board';

import { Content, ContentLayout, Button, Drawer, DatepickerPeriod, Input } from '@/shared/component';
import { createDynamicPath } from '@/shared/lib';
import { useAlertStore } from '@/shared/store';
import { useAuth } from '@/shared/auth';

import layoutStyles from '@/shared/component/layout/layout.module.scss';
import inputStyles from '@/shared/component/Input/Input.module.scss';

const toYYYYMMDD = (date) => {
  if (!date) return null;
  try {
    if (typeof date === 'string' && date.match(/^\d{4}-\d{2}-\d{2}$/)) return date;
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch (e) {
    return null;
  }
};

const setDateByPeriod = (period) => {
  const endDate = new Date();
  const startDate = new Date();

  switch (period) {
    case '1M':
      startDate.setMonth(endDate.getMonth() - 1);
      break;
    case '3M':
      startDate.setMonth(endDate.getMonth() - 3);
      break;
    case '6M':
      startDate.setMonth(endDate.getMonth() - 6);
      break;
    case '1Y':
      startDate.setFullYear(endDate.getFullYear() - 1);
      break;
    default:
      return { startDate: null, endDate: null };
  }
  return { startDate, endDate };
};

const BoardPage = function () {
  const router = useRouter();
  const urlSearchParams = useSearchParams();
  const { showSuccess, showError } = useAlertStore();
  const { user } = useAuth();

  const getInitialFilters = () => {
    const { startDate, endDate } = setDateByPeriod('1M');
    return {
      startDate,
      endDate,
      title: '',
      writerName: '',
      periodType: '1M'
    };
  };

  const initialFilters = getInitialFilters();

  const [loading, setLoading] = useState(true);
  const [boardData, setBoardData] = useState({
    list: [],
    pagination: { currentPage: 1, totalPages: 1, pageSize: 10, totalCount: 0 }
  });

  // 검색 필드 UI용 상태
  const [startDateState, setStartDate] = useState(initialFilters.startDate);
  const [endDateState, setEndDate] = useState(initialFilters.endDate);
  const [titleState, setTitle] = useState(initialFilters.title);
  const [writerNameState, setWriterName] = useState(initialFilters.writerName);
  const [periodType, setPeriodType] = useState(initialFilters.periodType);

  // API 호출용 파라미터 상태
  const [searchParams, setSearchParams] = useState({
    page: 1,
    size: 10,
    startDate: initialFilters.startDate,
    endDate: initialFilters.endDate,
    title: initialFilters.title,
    writerName: initialFilters.writerName
  });

  const selectedBoardId = useMemo(() => {
    const viewId = urlSearchParams.get('view');
    return viewId ? Number(viewId) : null;
  }, [urlSearchParams]);

  const updateUrlView = (boardId) => {
    const params = new URLSearchParams(urlSearchParams);
    if (boardId) {
      params.set('view', boardId);
    } else {
      params.delete('view');
    }
    router.push(`${createDynamicPath('/archive/board')}?${params.toString()}`);
  };

  const fetchList = async () => {
    setLoading(true);
    const result = await boardApi.getList({
      params: {
        ...searchParams,
        startDate: toYYYYMMDD(searchParams.startDate),
        endDate: toYYYYMMDD(searchParams.endDate)
      }
    });

    if (result) {
      setBoardData(BoardListEntity.fromApi(result));
    } else {
      setBoardData({ list: [], pagination: { currentPage: 1, totalPages: 1, pageSize: 10, totalCount: 0 } });
      showError('게시글 목록을 불러오는데 실패했습니다.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchList();
  }, [searchParams]);

  // 수정/삭제 후 목록으로 돌아왔을 때 팝업 표시
  useEffect(() => {
    if (urlSearchParams.get('isEdit') === 'true') {
      showSuccess('게시글이 수정되었습니다.');
    }
  }, [urlSearchParams]);

  const handleSearch = () => {
    setSearchParams((prev) => ({
      ...prev,
      page: 1,
      startDate: startDateState,
      endDate: endDateState,
      title: titleState,
      writerName: writerNameState
    }));
  };

  const handleClearSearch = () => {
    const initial = getInitialFilters();
    setStartDate(initial.startDate);
    setEndDate(initial.endDate);
    setTitle(initial.title);
    setWriterName(initial.writerName);
    setPeriodType(initial.periodType);
  };

  const handlePeriodChange = (period) => {
    setPeriodType(period);
    const { startDate, endDate } = setDateByPeriod(period);
    setStartDate(startDate);
    setEndDate(endDate);
  };

  const handlePageChange = (newPage) => {
    setSearchParams((prev) => ({ ...prev, page: newPage }));
  };

  const handleRowClick = (row) => {
    if (row?.id) {
      updateUrlView(row.id);
    }
  };

  const handleCloseDetailDrawer = () => {
    updateUrlView(null);
  };

  const handleCreateClick = () => {
    router.push(createDynamicPath('/archive/board/write'));
  };

  const handleEditClick = (id) => {
    router.push(createDynamicPath(`/archive/board/edit?id=${id}`));
  };

  const handleDeleteSuccess = () => {
    showSuccess('게시글이 삭제되었습니다.');
    handleCloseDetailDrawer();
    fetchList();
  };

  const columns = [
    { key: 'rowNumber', label: '번호', width: '10%', align: 'center' },
    { key: 'title', label: '제목', width: '60%' },
    { key: 'author', label: '작성자', width: '15%', align: 'center' },
    { key: 'createdAt', label: '작성일', width: '15%', align: 'center' }
  ];

  const tableData = boardData.list.map((item, index) => {
    const rowNumber =
      boardData.pagination?.currentPage && boardData.pagination?.pageSize
        ? (boardData.pagination.currentPage - 1) * boardData.pagination.pageSize + index + 1
        : index + 1;
    return Board.toTableRow(item, rowNumber);
  });

  return (
    <ContentLayout>
      <ContentLayout.Header title="게시글" subtitle="회사 게시글을 확인합니다.">
        <Button variant="primary" onClick={handleSearch} disabled={loading}>
          조회
        </Button>
        <Button variant="secondary" onClick={handleClearSearch} disabled={loading}>
          초기화
        </Button>
      </ContentLayout.Header>

      <Content.Full>
        <div className={layoutStyles.boardWrap}>
          <div className={layoutStyles.hasItem02}>
            <div className={inputStyles.wrapper}>
              <DatepickerPeriod
                label="조회 기간"
                startDate={startDateState}
                endDate={endDateState}
                onStartDateChange={setStartDate}
                onEndDateChange={setEndDate}
                startPlaceholder="시작일"
                endPlaceholder="종료일"
                disabled={loading}
              />
              <div className={layoutStyles.dateRangeBtn}>
                <RadioButton value={periodType} onChange={handlePeriodChange} disabled={loading} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <Input
                label="제목"
                value={titleState}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="제목으로 검색..."
                disabled={loading}
              />
              <Input
                label="작성자"
                value={writerNameState}
                onChange={(e) => setWriterName(e.target.value)}
                placeholder="작성자명으로 검색..."
                disabled={loading}
              />
            </div>
          </div>

          <div className={layoutStyles.hasTbBtn}>
            <div className={`${layoutStyles.tbBtnArea} ${layoutStyles.tbBtnAreaFull}`}>
              {user && (
                <Button variant="primary" onClick={handleCreateClick}>
                  글쓰기
                </Button>
              )}
            </div>
            <BoardList
              columns={columns}
              data={tableData}
              pagination={boardData.pagination}
              onRowClick={handleRowClick}
              onPageChange={handlePageChange}
              loading={loading}
            />
          </div>
        </div>
      </Content.Full>

      <Drawer isOpen={!!selectedBoardId} onClose={handleCloseDetailDrawer} title="게시글 상세">
        {selectedBoardId && (
          <BoardDetail
            boardId={selectedBoardId}
            onBack={handleCloseDetailDrawer}
            onEdit={handleEditClick}
            onDelete={handleDeleteSuccess}
          />
        )}
      </Drawer>
    </ContentLayout>
  );
};

export default BoardPage;
