import { DataTable, Pagination, Loading } from '@/shared/component';

import styles from './Board.module.scss';

/**
 * 게시글 목록 테이블 컴포넌트
 * @description 이 컴포넌트는 UI 로직을 포함하지 않는 "멍청한" 컴포넌트입니다.
 *              상위 컴포넌트로부터 `columns`와 `data`를 받아 그대로 `DataTable`에 전달하는 역할만 합니다.
 */
const BoardList = function (props) {
  const { columns, data, pagination, onRowClick, onPageChange, loading = false } = props;

  if (loading) {
    return <Loading message="로딩 중..." fullscreen={false} />;
  }

  return (
    <>
      <div className={styles.tableContainer}>
        <DataTable
          columns={columns}
          data={data}
          keyField="id"
          onRowClick={(row) => onRowClick(row.originalItem)}
          emptyMessage="게시글이 없습니다."
        />
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className={styles.pagination}>
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={onPageChange}
            pageSize={pagination.pageSize}
          />
        </div>
      )}
    </>
  );
};

export default BoardList;
