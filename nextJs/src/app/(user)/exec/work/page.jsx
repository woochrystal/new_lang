/*
 * path           : app/(user)/exec/work
 * fileName       : page.jsx
 * author         : Claude
 * date           : 25.12.11
 * description    : 내 프로젝트현황 페이지 (모든 사용자)
 * ===========================================================
 * DATE              AUTHOR        NOTE
 * -----------------------------------------------------------
 * 25.12.11        Claude       관리자 로직 분리 (사용자 전용)
 */
'use client';

import { useMemo } from 'react';
import { Content, ContentLayout, Loading } from '@/shared/component';
import { WorkList, workApi, WorkListEntity, Work } from '@/features/groupware/exec/work';
import { useApi } from '@/shared/hooks';

import styles from '@/shared/component/layout/layout.module.scss';

/**
 * 내 프로젝트현황 페이지 (모든 사용자)
 * @returns {JSX.Element}
 */
export default function MyWorkPage() {
  // API call - my projects only (no search parameters)
  const { data: result, isLoading } = useApi(function () {
    return workApi.getMyList({
      page: 1,
      size: 100 // Load all user's projects
    });
  }, []);

  // 엔티티 변환
  const workData = useMemo(
    function () {
      if (!result) {
        return {
          list: [],
          pagination: {
            currentPage: 1,
            totalPages: 1,
            pageSize: 100,
            totalCount: 0
          }
        };
      }

      // 배열인 경우 (페이징 정보 없음)
      if (Array.isArray(result)) {
        return {
          list: result.map((item) => Work.fromApi(item)),
          pagination: {
            currentPage: 1,
            totalPages: 1,
            pageSize: result.length,
            totalCount: result.length
          }
        };
      }

      // 객체인 경우 (페이징 정보 포함)
      if (result.list && Array.isArray(result.list)) {
        return WorkListEntity.fromApi(result);
      }

      return {
        list: [],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          pageSize: 100,
          totalCount: 0
        }
      };
    },
    [result]
  );

  // User columns (NO employee name column) -  width 변경 예정
  const columns = useMemo(function () {
    return [
      { key: 'rowNumber', label: '번호', width: '80px' },
      { key: 'client', label: '고객사', width: '150px' },
      { key: 'projectName', label: '프로젝트명' },
      { key: 'status', label: '진행상태', width: '120px' },
      { key: 'startDate', label: '투입일', width: '120px' },
      { key: 'endDate', label: '철수일', width: '120px' },
      { key: 'location', label: '장소', width: '200px' }
    ];
  }, []);

  // 테이블 데이터 변환
  const tableData = workData.list.map(function (item, index) {
    return Work.toTableRow(item, index + 1);
  });

  return (
    <ContentLayout>
      <ContentLayout.Header title="내 프로젝트현황" subtitle="내가 투입된 프로젝트 현황" />

      <Content.Full>
        <div className={styles.boardWrap}>
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loading message="데이터를 불러오는 중입니다..." />
            </div>
          ) : (
            <WorkList
              data={tableData}
              columns={columns}
              pagination={workData.pagination}
              onPageChange={function () {}}
              loading={isLoading}
            />
          )}
        </div>
      </Content.Full>
    </ContentLayout>
  );
}
