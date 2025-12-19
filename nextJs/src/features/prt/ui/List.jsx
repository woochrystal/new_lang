import { DataTable, Pagination, Loading } from '@/shared/component';

import styles from './Partner.module.scss';
import layoutStyles from '@/shared/component/layout/layout.module.scss';

/**
 * 협력사 테이블 컴포넌트 (DataTable + Pagination 기반 현대화)
 * @param {Object} props
 * @param {Array} props.columns - 컬럼 정의 [{ key, label }]
 * @param {Array} props.data - 테이블 데이터
 * @param {Object} props.pagination - 페이지 정보 { currentPage, totalPages, pageSize }
 * @param {Function} props.onRowClick - 행 클릭 핸들러
 * @param {Function} props.onPageChange - 페이지 변경 핸들러
 * @param {boolean} [props.loading=false] - 로딩 상태
 */
const PartnerTableList = function (props) {
  const { columns, data, pagination, onRowClick, onPageChange, loading = false } = props;

  // 로딩 중
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
          keyField="id"
          onRowClick={(row) => onRowClick(row.originalItem)}
          emptyMessage="협력사가 없습니다."
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

export default PartnerTableList;
