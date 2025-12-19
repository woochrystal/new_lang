import { DataTable, Loading, Pagination } from '@/shared/component';

import styles from '@/shared/component/layout/layout.module.scss';

/**
 * 결재 문서 목록 테이블 컴포넌트
 */
const VacExpenseList = (props) => {
  const { columns, data, pagination, onRowClick, onPageChange, loading = false } = props;

  // 로딩 중
  if (loading) {
    return <Loading message="로딩 중..." fullscreen={false} />;
  }

  return (
    <>
      {/* DataTable 컴포넌트 */}
      <div className={styles.tableContainer}>
        <DataTable
          columns={columns}
          data={data}
          keyField="id"
          onRowClick={(row) => onRowClick(row.originalItem)}
          emptyMessage="결재 문서가 없습니다."
        />
      </div>

      {/* 페이지네이션 */}
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

export default VacExpenseList;
