/*
 * path           : app/(user)/cust
 * fileName       : page.jsx
 * author         : 이승진
 * date           : 2025.12.16
 * description    : 고객사 관리 페이지 (READ-ONLY: 조회 전용)
 * ===========================================================
 * DATE              AUTHOR        NOTE
 * -----------------------------------------------------------
 * 2025.12.16        이승진   최초 생성
 */
'use client';

import { useState } from 'react';

import { CustList, CustSearch, custApi, CUST_CONSTANTS, CustListEntity, Cust } from '@/features/cust';
import { Content, ContentLayout, Button } from '@/shared/component';
import { useApi } from '@/shared/hooks';

//공통디자인 scss
import styles from '@/shared/component/layout/layout.module.scss';

const CustPage = function () {
  const [searchParams, setSearchParams] = useState({
    page: 1,
    size: CUST_CONSTANTS.DEFAULT_PAGE_SIZE,
    searchKeyword: ''
  });
  const [searchInput, setSearchInput] = useState({
    tenantName: ''
  });

  const { data: result, isLoading } = useApi(
    () =>
      custApi.getList({
        page: searchParams.page || 1,
        size: searchParams.size || 10,
        searchKeyword: searchParams.searchKeyword
      }),
    [searchParams]
  );

  const custData = result
    ? CustListEntity.fromApi(result)
    : { list: [], pagination: { currentPage: 1, totalPages: 1, pageSize: 10, totalCount: 0 } };

  const handleSearch = function () {
    setSearchParams({
      ...searchParams,
      page: 1,
      searchKeyword: searchInput.tenantName
    });
  };

  const handleReset = function () {
    setSearchInput({
      tenantName: ''
    });
    setSearchParams({
      page: 1,
      size: CUST_CONSTANTS.DEFAULT_PAGE_SIZE,
      searchKeyword: ''
    });
  };

  const handlePageChange = function (newPage) {
    setSearchParams({ ...searchParams, page: newPage });
  };

  const columns = [
    { key: 'rowNumber', label: '번호' },
    { key: 'tenantName', label: '고객사명' },
    { key: 'domainPath', label: '도메인경로' },
    { key: 'tenantStatus', label: '고객사상태' },
    { key: 'contractPeriod', label: '계약기간' },
    { key: 'voucherYn', label: '바우처여부' },
    { key: 'managerName', label: '관리자명' },
    { key: 'managerEmail', label: '관리자이메일' },
    { key: 'tenantTel', label: '전화번호' },
    { key: 'registeredAt', label: '등록일시' }
  ];

  const tableData = custData.list.map(function (item, index) {
    const rowNumber =
      custData.pagination?.currentPage && custData.pagination?.pageSize
        ? (custData.pagination.currentPage - 1) * custData.pagination.pageSize + index + 1
        : index + 1;

    return Cust.toTableRow(item, rowNumber);
  });

  return (
    <ContentLayout>
      <ContentLayout.Header title="고객사 관리" subtitle="고객사(테넌트) 정보 조회">
        <Button variant="primary" onClick={handleSearch}>
          조회
        </Button>
      </ContentLayout.Header>

      <Content.Full>
        <div className={styles.boardWrap}>
          <CustSearch
            tenantName={searchInput.tenantName}
            onTenantNameChange={function (e) {
              setSearchInput({ ...searchInput, tenantName: e.target.value });
            }}
            onSearch={handleSearch}
          />

          <div className={styles.tableContainer}>
            <CustList
              columns={columns}
              data={tableData}
              pagination={custData.pagination}
              onPageChange={handlePageChange}
              loading={isLoading}
            />
          </div>
        </div>
      </Content.Full>
    </ContentLayout>
  );
};

export default CustPage;
