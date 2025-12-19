import { DataTable, Pagination, Button, Loading } from '@/shared/component';

import styles from './Approval.module.scss';

/**
 * 결재 문서 목록 테이블 컴포넌트
 * @param {Object} props
 * @param {Array} props.columns - 컬럼 정의 [{ key, label }]
 * @param {Array} props.data - 테이블 데이터
 * @param {Object} props.pagination - 페이지 정보 { currentPage, totalPages, pageSize }
 * @param {Function} props.onRowClick - 행 클릭 핸들러
 * @param {Function} props.onEdit - 수정 버튼 핸들러
 * @param {Function} props.onDelete - 삭제 버튼 핸들러
 * @param {Function} props.onPageChange - 페이지 변경 핸들러
 * @param {boolean} [props.loading=false] - 로딩 상태
 * @param {boolean} [props.showActions=true] - 액션 버튼 표시 여부
 */
const ApprovalList = (props) => {
  const {
    columns,
    data,
    pagination,
    onRowClick,
    onEdit,
    onDelete,
    onPageChange,
    loading = false,
    showActions = true
  } = props;

  // 로딩 중
  if (loading) {
    return <Loading message="로딩 중..." fullscreen={false} />;
  }

  // 액션 열을 추가한 컬럼 정의 (중복 확인)
  const hasActionsColumn = columns.some((col) => col.key === 'actions');
  const tableColumns = columns;

  // 액션 버튼 렌더러 (액션 컬럼이 없을 때만 추가)
  const renderers =
    showActions && !hasActionsColumn
      ? {
          actions: (value, row) => (
            <div className={styles.actionButtons}>
              <Button
                variant="secondary"
                className={styles.buttonSmall}
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(row.id);
                }}
              >
                수정
              </Button>
              <Button
                variant="secondary"
                className={`${styles.buttonDanger} ${styles.buttonSmall}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(row.id, e);
                }}
              >
                삭제
              </Button>
            </div>
          )
        }
      : {};

  return (
    <>
      {/* DataTable 컴포넌트 */}
      <div className={styles.tableContainer}>
        <DataTable
          columns={tableColumns}
          data={data}
          keyField="id"
          renderers={renderers}
          onRowClick={(row) => onRowClick(row.originalItem)}
          emptyMessage="결재 문서가 없습니다."
        />
      </div>

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
    </>
  );
};

export default ApprovalList;
