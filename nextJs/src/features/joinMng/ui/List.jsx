import { DataTable, Pagination, Loading } from '@/shared/component';

import styles from './JoinMng.module.scss';
import layoutStyles from '@/shared/component/layout/layout.module.scss';

/**
 * 가입신청 테이블 컴포넌트
 */
const JoinMngTableList = function (props) {
  const { columns, data, pagination, onRowClick, onPageChange, loading = false } = props;

  if (loading) {
    return <Loading message="로딩 중..." fullscreen={false} />;
  }

  return (
    <>
      {/* DataTable 컴포넌트 */}
      <div className={layoutStyles.tableContainer}>
        <DataTable
          columns={columns}
          data={data}
          keyField="joinId"
          onRowClick={(row) => onRowClick(row.originalItem)}
          emptyMessage="가입신청 내역이 없습니다."
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

export default JoinMngTableList;
