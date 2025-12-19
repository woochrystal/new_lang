'use client';

import { DataTable, Pagination, Loading } from '@/shared/component';

//공통디자인 scss
import styles from '@/shared/component/layout/layout.module.scss';

/**
 * 휴가일수 목록 테이블 컴포넌트
 * @param {Object} props
 * @param {Array} props.columns - 컬럼 정의 [{ key, label }]
 * @param {Array} props.data - 테이블 데이터
 * @param {Object} props.pagination - 페이지 정보 { currentPage, totalPages, pageSize }
 * @param {Function} props.onRowClick - 행 클릭 핸들러
 * @param {Function} props.onPageChange - 페이지 변경 핸들러
 * @param {boolean} [props.loading=false] - 로딩 상태
 */
const VacCntList = function (props) {
  const { columns, data, pagination, onRowClick, onPageChange, loading = false } = props;

  // 로딩 중
  if (loading) {
    return <Loading message="휴가일수 목록 로딩 중..." fullscreen={false} />;
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
          emptyMessage="등록된 휴가일수 데이터가 없습니다."
        />

        {/* 페이지네이션 */}
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
      </div>
    </>
  );
};

export default VacCntList;
