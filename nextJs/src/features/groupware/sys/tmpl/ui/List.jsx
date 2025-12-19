'use client';

import { DataTable, Pagination } from '@/shared/component';

/**
 * 템플릿 목록 컴포넌트
 * @param {Object} props
 * @param {Array} props.data - 테이블 데이터
 * @param {Object} props.pagination - 페이지네이션 정보
 * @param {Function} props.onRowClick - 행 클릭 핸들러
 * @param {Function} props.onPageChange - 페이지 변경 핸들러
 */
const TmplList = function (props) {
  const { data, pagination, onRowClick, onPageChange } = props;

  // 테이블 컬럼 정의
  const columns = [
    { key: 'rowNumber', label: '번호', width: '60px' },
    { key: 'title', label: '제목' },
    { key: 'authorName', label: '작성자', width: '100px' },
    { key: 'createdAt', label: '등록일', width: '120px' },
    { key: 'updatedAt', label: '수정일', width: '120px' },
    { key: 'useYn', label: '사용여부', width: '100px' }
  ];

  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        keyField="id"
        onRowClick={(row) => onRowClick(row.originalItem)}
        emptyMessage="등록된 템플릿이 없습니다."
      />

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

export default TmplList;
