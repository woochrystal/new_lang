/*
 * path           : app/groupware/(member)/archive/notice/sysadmin
 * fileName       : page.jsx
 * author         : 자동 생성
 * date           : 2024-07-29
 * description    : 시스템 관리자용 시스템 공지사항 관리 페이지
 * ===========================================================
 * DATE              AUTHOR        NOTE
 * -----------------------------------------------------------
 * 2024-07-29        자동 생성       최초 생성
 */
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { noticeApi, NoticeListEntity, Notice, NoticeDetail, NoticeList } from '@/features/notice';

import { Content, ContentLayout, Button, Drawer } from '@/shared/component';
import { createDynamicPath } from '@/shared/lib';
import { useAlertStore } from '@/shared/store';

import boardStyles from '@/features/notice/ui/Board.module.scss';

const SysNoticeAdminPage = function () {
  const router = useRouter();
  const urlSearchParams = useSearchParams();
  const { showError } = useAlertStore();

  const [loading, setLoading] = useState(true);
  const [noticeData, setNoticeData] = useState({
    list: [],
    pagination: { currentPage: 1, totalPages: 1, pageSize: 10, totalCount: 0 }
  });

  const [searchParams, setSearchParams] = useState({
    page: 1,
    size: 10,
    boardTy: 'SYSNOTICE' // 시스템 공지만 필터링
  });

  const selectedNoticeId = useMemo(() => {
    const viewId = urlSearchParams.get('view');
    return viewId ? Number(viewId) : null;
  }, [urlSearchParams]);

  const updateUrlView = (noticeId) => {
    const params = new URLSearchParams(urlSearchParams);
    if (noticeId) {
      params.set('view', noticeId);
    } else {
      params.delete('view');
    }
    router.push(`${createDynamicPath('/archive/notice/sysadmin')}?${params.toString()}`);
  };

  const fetchList = async () => {
    setLoading(true);
    const result = await noticeApi.getList({ params: searchParams });

    if (result) {
      setNoticeData(NoticeListEntity.fromApi(result));
    } else {
      setNoticeData({ list: [], pagination: { currentPage: 1, totalPages: 1, pageSize: 10, totalCount: 0 } });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchList();
  }, [searchParams]);

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

  const handleEditClick = (id) => {
    router.push(createDynamicPath(`/archive/notice/sysadmin/edit?id=${id}`));
  };

  const handleDeleteSuccess = () => {
    handleCloseDetailDrawer();
    fetchList();
  };

  const columns = [
    { key: 'rowNumber', label: '번호', width: '10%', align: 'center' },
    { key: 'title', label: '제목', width: '60%' },
    { key: 'author', label: '작성자', width: '15%', align: 'center' },
    { key: 'createdAt', label: '작성일', width: '15%', align: 'center' }
  ];

  const tableData = noticeData.list.map((item, index) => {
    const rowNumber =
      noticeData.pagination?.currentPage && noticeData.pagination?.pageSize
        ? (noticeData.pagination.currentPage - 1) * noticeData.pagination.pageSize + index + 1
        : index + 1;

    const tableRow = Notice.toTableRow(item, rowNumber);

    let titleClassName = '';
    if (tableRow.originalItem?.type === 'SYSNOTICE') {
      titleClassName = boardStyles.sysNotice;
    } else if (tableRow.originalItem?.isPriority) {
      titleClassName = boardStyles.priorityNotice;
    }
    tableRow.title = <span className={titleClassName}>{tableRow.title}</span>;

    return tableRow;
  });

  return (
    <ContentLayout>
      <ContentLayout.Header title="시스템 공지 관리" subtitle="시스템 공지사항을 등록, 수정, 삭제합니다.">
        <Button variant="primary" onClick={() => router.push(createDynamicPath('/archive/notice/sysadmin/write'))}>
          글쓰기
        </Button>
      </ContentLayout.Header>

      <Content.Full className="pt-10">
        <NoticeList
          columns={columns}
          data={tableData}
          pagination={noticeData.pagination}
          onRowClick={handleRowClick}
          onPageChange={handlePageChange}
          loading={loading}
        />
      </Content.Full>

      <Drawer isOpen={!!selectedNoticeId} onClose={handleCloseDetailDrawer} title="공지사항 상세">
        {selectedNoticeId && (
          <NoticeDetail
            noticeId={selectedNoticeId}
            onBack={handleCloseDetailDrawer}
            onEdit={handleEditClick}
            onDelete={handleDeleteSuccess}
          />
        )}
      </Drawer>
    </ContentLayout>
  );
};

export default SysNoticeAdminPage;
