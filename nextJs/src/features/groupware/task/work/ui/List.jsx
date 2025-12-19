/**
 * @fileoverview 프로젝트관리 목록 컴포넌트
 * @description DataTable 기반 프로젝트 목록 및 페이지네이션
 */

'use client';

import { DataTable, Pagination, Loading, Checkbox } from '@/shared/component';

import styles from '@/shared/component/layout/layout.module.scss';

/**
 * 프로젝트관리 목록 컴포넌트
 * @param {Object} props
 * @param {Array} props.columns - 테이블 컬럼 정의
 * @param {Array} props.data - 테이블 데이터
 * @param {Object} props.pagination - 페이지네이션 정보
 * @param {Function} props.onPageChange - 페이지 변경 핸들러
 * @param {Function} [props.onRowClick] - 행 클릭 핸들러
 * @param {Array} [props.selectedIds=[]] - 선택된 항목 ID 목록
 * @param {Function} [props.onSelect] - 체크박스 선택 핸들러
 * @param {Function} [props.onSelectAll] - 전체 선택 핸들러
 * @param {boolean} [props.loading=false] - 로딩 상태
 */
const List = function ({
  columns,
  data,
  pagination,
  onPageChange,
  onRowClick,
  selectedIds = [],
  onSelect,
  onSelectAll,
  loading = false
}) {
  if (loading) {
    return <Loading message="로딩 중..." fullscreen={false} />;
  }

  // 체크박스 컬럼 추가 여부
  const hasCheckbox = !!onSelect && !!onSelectAll;
  const isAllSelected = data.length > 0 && selectedIds.length === data.length;

  const displayColumns = hasCheckbox ? [{ key: 'checkbox', label: '' }, ...columns] : columns;

  // 헤더 렌더러 (체크박스 전체 선택)
  const headerRenderers = hasCheckbox
    ? {
        checkbox: () => (
          <div
            className={styles.checkboxCell}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <Checkbox
              id="work-checkbox-all"
              checked={isAllSelected}
              onChange={(checked, e) => {
                if (e) {
                  e.stopPropagation();
                }
                onSelectAll();
              }}
            />
          </div>
        )
      }
    : {};

  // 체크박스 렌더러 추가
  const renderers = hasCheckbox
    ? {
        checkbox: (value, row) => (
          <div
            className={styles.checkboxCell}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <Checkbox
              id={`work-checkbox-${row.id}`}
              checked={selectedIds.includes(row.id)}
              onChange={(checked, e) => {
                if (e) {
                  e.stopPropagation();
                }
                onSelect(row.id);
              }}
            />
          </div>
        )
      }
    : {};

  return (
    <>
      <div className={styles.tableContainer}>
        <DataTable
          columns={displayColumns}
          data={data}
          keyField="id"
          onRowClick={onRowClick}
          renderers={renderers}
          headerRenderers={headerRenderers}
          emptyMessage="검색결과가 없습니다."
        />
      </div>

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

export default List;
