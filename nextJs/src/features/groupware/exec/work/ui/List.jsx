/**
 * @fileoverview 프로젝트현황 목록 컴포넌트
 * @description DataTable 기반 프로젝트현황 목록 및 페이지네이션
 */

'use client';

import { DataTable, Pagination, Loading } from '@/shared/component';

//공통디자인 scss
import styles from '@/shared/component/layout/layout.module.scss';

/**
 * 프로젝트현황 목록 컴포넌트
 * @param {Object} props
 * @param {Array} props.columns - 테이블 컬럼 정의
 * @param {Array} props.data - 테이블 데이터
 * @param {Object} props.pagination - 페이지네이션 정보
 * @param {Function} props.onPageChange - 페이지 변경 핸들러
 * @param {Function} [props.onRowClick] - 행 클릭 핸들러
 * @param {boolean} [props.loading=false] - 로딩 상태
 */
const WorkList = function ({ columns, data, pagination, onPageChange, onRowClick, loading = false }) {
  // 로딩 중
  if (loading) {
    return <Loading message="프로젝트현황 로딩 중..." fullscreen={false} />;
  }

  return (
    <>
      {/* DataTable 컴포넌트 */}
      <div className={styles.tableContainer}>
        <DataTable
          columns={columns}
          data={data}
          keyField="id"
          onRowClick={onRowClick}
          emptyMessage="검색결과가 없습니다."
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

export default WorkList;
