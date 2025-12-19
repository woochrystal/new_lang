'use client';

import { DataTable, Pagination, Loading, Tag } from '@/shared/component';
import { CUST_CONSTANTS } from '../script/constants';
import styles from '@/shared/component/layout/layout.module.scss';

const CustList = function (props) {
  const { columns, data, pagination, onPageChange, loading = false } = props;

  if (loading) {
    return <Loading message="로딩 중..." fullscreen={false} />;
  }

  const renderers = {
    tenantStatus: (value) => {
      const variant = CUST_CONSTANTS.TENANT_STATUS_VARIANT[value] || 'default';
      const label = CUST_CONSTANTS.TENANT_STATUS[value] || value;
      return <Tag variant={variant}>{label}</Tag>;
    }
  };

  return (
    <>
      <div className={styles.tableContainer}>
        <DataTable
          columns={columns}
          data={data}
          keyField="id"
          renderers={renderers}
          emptyMessage="고객사 데이터가 없습니다."
        />

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

export default CustList;
