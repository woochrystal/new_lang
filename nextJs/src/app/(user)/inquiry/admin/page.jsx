/*
 * path           : app/groupware/(member)/inquiry/admin
 * fileName       : page.jsx
 * author         : 박재민
 * date           : 25. 12. 3.
 * description    : 시스템 관리자용 문의 답변/관리 페이지
 * ===========================================================
 * DATE              AUTHOR        NOTE
 * -----------------------------------------------------------
 * 25. 12. 3.        박재민       최초 생성
 */
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { inquiryApi, Inquiry, InquiryListEntity, InquiryTableList, InquiryDetail } from '@/features/inquiry';

import { useAuth } from '@/shared/auth';
import { Content, ContentLayout, Button, Drawer, Loading } from '@/shared/component';
import { createDynamicPath } from '@/shared/lib';
import { useAlertStore } from '@/shared/store';

import inquiryStyles from '@/features/inquiry/ui/Inquiry.module.scss';

const InquiryAdminPage = () => {
  const router = useRouter();
  const urlSearchParams = useSearchParams();
  const { user, isLoading: isAuthLoading } = useAuth();
  const { showError } = useAlertStore();

  const [loading, setLoading] = useState(true);
  const [inquiryData, setInquiryData] = useState({
    list: [],
    pagination: { currentPage: 1, totalPages: 1, pageSize: 10, totalCount: 0 }
  });
  const [searchParams, setSearchParams] = useState({ page: 1, size: 10 });

  const hasPermission = useMemo(() => user && user.usrRole === 'SYSADM', [user]);

  useEffect(() => {
    if (!isAuthLoading && !hasPermission) {
      showError('이 페이지에 접근할 권한이 없습니다.');
      router.replace('/');
    }
  }, [isAuthLoading, hasPermission, showError, router]);

  const selectedInquiryId = useMemo(() => {
    const viewId = urlSearchParams.get('view');
    return viewId ? Number(viewId) : null;
  }, [urlSearchParams]);

  const fetchInquiries = async () => {
    if (!hasPermission) return;
    setLoading(true);
    const result = await inquiryApi.getAdminInquiries({ params: searchParams });
    if (result && result.data) {
      const processedData = InquiryListEntity.fromApi(result.data);
      setInquiryData(processedData);
    } else {
      setInquiryData({ list: [], pagination: { currentPage: 1, totalPages: 1, pageSize: 10, totalCount: 0 } });
    }
    setLoading(false);
  };

  useEffect(() => {
    if (hasPermission) {
      void fetchInquiries();
    }
  }, [hasPermission, searchParams]);

  const updateUrlView = (inquiryId) => {
    const params = new URLSearchParams(urlSearchParams);
    if (inquiryId) {
      params.set('view', inquiryId);
    } else {
      params.delete('view');
    }
    router.push(`${createDynamicPath('/inquiry/admin')}?${params.toString()}`);
  };

  const handleRowClick = (row) => {
    if (row?.originalItem?.id) {
      updateUrlView(row.originalItem.id);
    }
  };

  const handleCloseDetailDrawer = () => {
    updateUrlView(null);
  };

  const handleUpdate = () => {
    void fetchInquiries();
  };

  const handlePageChange = (newPage) => {
    setSearchParams((prev) => ({ ...prev, page: newPage }));
  };

  const columns = [
    { key: 'rowNumber', label: '번호', width: '10%', align: 'center' },
    { key: 'title', label: '제목', width: '50%' },
    { key: 'author', label: '작성자', width: '15%', align: 'center' },
    { key: 'createdAt', label: '등록일', width: '15%', align: 'center' },
    { key: 'status', label: '상태', width: '10%', align: 'center' }
  ];

  const renderers = {
    status: (value, row) => {
      let statusClassName = '';
      if (row.originalItem?.status === 'COMPLETED') {
        statusClassName = inquiryStyles.completedStatus;
      } else if (row.originalItem?.status === 'IN_PROGRESS') {
        statusClassName = inquiryStyles.inProgressStatus;
      } else {
        statusClassName = inquiryStyles.pendingStatus;
      }

      return (
        <div className="w-full flex justify-center">
          <span className={statusClassName}>{value}</span>
        </div>
      );
    }
  };

  const tableData = inquiryData.list.map((item, index) => {
    const rowNumber =
      inquiryData.pagination?.currentPage && inquiryData.pagination?.pageSize
        ? (inquiryData.pagination.currentPage - 1) * inquiryData.pagination.pageSize + index + 1
        : index + 1;
    return Inquiry.toTableRow(item, rowNumber);
  });

  if (isAuthLoading || !hasPermission) {
    return <Loading message="권한을 확인 중입니다..." />;
  }

  return (
    <ContentLayout>
      <ContentLayout.Header title="문의 관리" subtitle="사용자 문의를 확인하고 답변합니다." />
      <Content.Full className="flex flex-col gap-4 pt-10">
        <div className="relative z-0">
          <InquiryTableList
            columns={columns}
            data={tableData}
            loading={loading}
            onRowClick={handleRowClick}
            renderers={renderers}
            pagination={inquiryData.pagination}
            onPageChange={handlePageChange}
          />
        </div>
      </Content.Full>

      <Drawer isOpen={!!selectedInquiryId} onClose={handleCloseDetailDrawer} title="문의 상세">
        {selectedInquiryId && (
          <InquiryDetail
            inquiryId={selectedInquiryId}
            onBack={handleCloseDetailDrawer}
            onUpdate={handleUpdate}
            isAdminView={true}
          />
        )}
      </Drawer>
    </ContentLayout>
  );
};

export default InquiryAdminPage;
