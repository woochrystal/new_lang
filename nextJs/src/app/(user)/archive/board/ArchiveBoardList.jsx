/**
 * 아카이브 게시판 테이블 + 페이지네이션 컴포넌트
 */
'use client';

import { DataTable, Pagination, Loading } from '@/shared/component';
import styles from '@/features/example/ui/Example.module.scss'; // 스타일은 example의 것을 그대로 사용

export default function ArchiveBoardList({ columns, data, pagination, onRowClick, onPageChange, loading = false }) {
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
          keyField="boardId" // boardId를 고유 키로 사용
          onRowClick={onRowClick}
          emptyMessage="게시글이 없습니다."
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
}
