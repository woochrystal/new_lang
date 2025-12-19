'use client';

import { DataTable, Pagination, Loading, Tag, Checkbox } from '@/shared/component';

//공통디자인 scss
import styles from '@/shared/component/layout/layout.module.scss';

/**
 * 직원 목록 테이블 컴포넌트
 * @param {Object} props
 * @param {Array} props.columns - 컬럼 정의 [{ key, label }]
 * @param {Array} props.data - 테이블 데이터
 * @param {Object} props.pagination - 페이지 정보 { currentPage, totalPages, pageSize }
 * @param {Function} props.onRowClick - 행 클릭 핸들러
 * @param {Function} props.onPageChange - 페이지 변경 핸들러
 * @param {boolean} [props.loading=false] - 로딩 상태
 * @param {Array} props.selectedEmps - 선택된 직원 사번 목록
 * @param {Function} props.onSelectEmp - 직원 선택 핸들러
 * @param {Function} props.onSelectAll - 전체 선택 핸들러
 */
const EmpList = function (props) {
  const {
    columns,
    data,
    pagination,
    onRowClick,
    onPageChange,
    loading = false,
    selectedEmps = [],
    onSelectEmp,
    onSelectAll
  } = props;

  // 로딩 중
  if (loading) {
    return <Loading message="직원 목록 로딩 중..." fullscreen={false} />;
  }

  // 체크박스 컬럼 추가
  const tableColumns = [{ key: 'checkbox', label: '' }, ...columns];

  // 상태 배지 variant 매핑
  const getStatusVariant = (status) => {
    switch (status) {
      case '승인':
        return 'success';
      case '반려':
        return 'danger';
      case '미결':
        return 'warning';
      default:
        return 'default';
    }
  };

  // 전체 선택 여부
  const isAllSelected = data.length > 0 && selectedEmps.length === data.length;

  // 렌더러
  const renderers = {
    checkbox: (value, row) => (
      <div
        className={styles.checkboxCell}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <Checkbox
          id={`emp-checkbox-${row.empNo}`}
          checked={selectedEmps.includes(row.empNo)}
          onChange={(checked, e) => {
            if (e) {
              e.stopPropagation();
            }
            onSelectEmp(row.empNo);
          }}
        />
      </div>
    ),
    workStatus: (value) => (
      <Tag variant={getStatusVariant(value)} size="sm">
        {value}
      </Tag>
    )
  };

  // 헤더 렌더러 (체크박스 전체 선택)
  const headerRenderers = {
    checkbox: () => (
      <div
        className={styles.checkboxCell}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <Checkbox
          id="emp-checkbox-all"
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
  };

  return (
    <>
      {/* DataTable 컴포넌트 */}
      <div className={styles.tableContainer}>
        <DataTable
          columns={tableColumns}
          data={data}
          keyField="id"
          renderers={renderers}
          headerRenderers={headerRenderers}
          onRowClick={(row) => onRowClick(row.originalItem)}
          emptyMessage="등록된 직원이 없습니다."
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

export default EmpList;
