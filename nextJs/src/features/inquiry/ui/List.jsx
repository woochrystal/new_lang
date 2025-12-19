import { DataTable, Pagination, Loading } from '@/shared/component';

const InquiryTableList = (props) => {
  const { columns, data, pagination, onRowClick, onPageChange, loading = false, renderers } = props;

  if (loading) {
    return <Loading message="문의 목록을 불러오는 중..." fullscreen={false} />;
  }

  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        keyField="id"
        onRowClick={onRowClick}
        emptyMessage="등록된 문의가 없습니다."
        renderers={renderers}
      />
      {pagination && pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={onPageChange}
          pageSize={pagination.pageSize}
        />
      )}
    </>
  );
};

export default InquiryTableList;
