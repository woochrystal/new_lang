'use client';

// ============================================================================
// Imports
// ============================================================================
import React, { useMemo } from 'react';

import styles from './table.module.scss';

// ============================================================================
// Component
// ============================================================================

/**
 * 데이터 테이블 자동 렌더링 컴포넌트
 *
 * columns과 data props를 받아서 자동으로 테이블을 렌더링합니다
 *
 * @param {Object} props
 * @param {Array<{key: string, label: string, width?: string}>} props.columns - 테이블 컬럼 정의
 * @param {Array<Object>} props.data - 테이블 데이터 배열
 * @param {Function} [props.onRowClick] - 행 클릭 콜백 (row, index) => void
 * @param {Object} [props.renderers] - 셀 커스텀 렌더러 {key: (value, row, index) => ReactNode}
 * @param {Object} [props.headerRenderers] - 헤더 셀 커스텀 렌더러 {key: () => ReactNode}
 * @param {string} [props.keyField='id'] - 각 행의 고유 키 필드
 * @param {string} [props.className] - 추가 CSS 클래스
 * @param {string} [props.emptyMessage] - 데이터가 없을 때 표시할 메시지
 *
 * @example
 * // 기본 데이터 테이블
 * <DataTable
 *   columns={[
 *     { key: 'id', label: '번호', width: '80px' },
 *     { key: 'title', label: '제목' },
 *     { key: 'author', label: '작성자', width: '120px' }
 *   ]}
 *   data={[
 *     { id: 1, title: '첫 번째 게시물', author: '홍길동' },
 *     { id: 2, title: '두 번째 게시물', author: '김철수' }
 *   ]}
 *   onRowClick={(row) => console.log(row)}
 * />
 *
 * @example
 * // 커스텀 렌더러 포함
 * <DataTable
 *   columns={[...]}
 *   data={data}
 *   renderers={{
 *     title: (value, row) => <a href={`/detail/${row.id}`}>{value}</a>,
 *     status: (value) => <Badge status={value}>{value}</Badge>
 *   }}
 *   headerRenderers={{
 *     checkbox: () => <Checkbox checked={isAllSelected} onChange={handleSelectAll} />
 *   }}
 * />
 */
export const DataTable = ({
  columns = [],
  data = [],
  onRowClick,
  renderers = {},
  headerRenderers = {},
  keyField = 'id',
  className = '',
  emptyMessage,
  ...rest
}) => {
  // ==========================================================================
  // Computed (계산된 값)
  // ==========================================================================

  const tableClasses = useMemo(() => {
    return [styles.table, className].filter(Boolean).join(' ');
  }, [className]);

  // 키 값 확인(td width 조정 등 디버깅용- 전체 확인 후 삭제 예정) - wsj
  console.log(
    '컬럼 key:',
    columns.map((col) => col.key)
  );

  // ==========================================================================
  // Render (렌더링)
  // ==========================================================================

  return (
    <table className={tableClasses} {...rest}>
      {/* 테이블 헤더 */}
      <thead className={styles.thead}>
        <tr>
          {columns.map((column) => {
            const headerRenderer = headerRenderers[column.key];
            const headerContent = headerRenderer ? headerRenderer() : column.label;

            return (
              <th key={column.key} className={styles.th} style={{ width: column.width }}>
                {headerContent}
              </th>
            );
          })}
        </tr>
      </thead>

      {/* 테이블 바디 */}
      <tbody className={styles.tbody}>
        {data.length > 0 ? (
          data.map((row, rowIndex) => (
            <tr
              key={row[keyField] || rowIndex}
              onClick={() => onRowClick?.(row, rowIndex)}
              style={{ cursor: onRowClick ? 'pointer' : 'default' }}
            >
              {columns.map((column) => {
                const value = row[column.key];
                const renderer = renderers[column.key];
                const rendered = renderer ? renderer(value, row, rowIndex) : value;

                // key별 클래스 맵
                const tdClassMap = {
                  /*
                    1. 글 정렬 왼쪽일 시 : styles.tdTextLeft
                    2. 버튼/체크박스 있을 시 : styles.tdHasBtn
                    2. 셀렉트박스 있을 시 : styles.tdHasSelect
                    3. 말줄임 필요 :
                      width 클래스명 뒤에 Max 붙여서 추가 필수 (ex. tdMd -> tdMdMax)
                      `${styles.tdEllipsis} ${styles.tdMdMax}`
                    4. width 값에 따른 클래스명 = ({
                      tdXxs: 60px;
                      tdXs: 80px;
                      tdSm: 100px;
                      tdMd: 120px;
                      tdLg: 150px;
                      tdXl: 200px;
                      tdXxl: 250px;
                    })
                    5. 나머지 : td + key값 앞글자 대문자 (ex. year -> tdYear)
                        styles 없으면 규칙대로 생성 후 말해주기
                    6. 클래스 두개 이상 사용 시
                    : ex) 번호(번호, 버튼있음) -> `${styles.tdHasBtn} ${styles.tdYear}`
                  */

                  checkbox: `${styles.tdHasBtn} ${styles.tdCheckbox}`, //체크박스
                  rowNumber: styles.tdXs, //번호
                  title: styles.tdTextLeft, //제목
                  createdAt: styles.tdXxl, //작성일
                  author: styles.tdXl, //작성자
                  actions: `${styles.tdHasBtn} ${styles.tdLg}`, //버튼있는 td
                  year: styles.tdYear, //연도
                  usedVacationDays: styles.tdVacationDays,
                  totalVacationDays: styles.tdVacationDays, //휴가사용일수, 휴가여분일수
                  status: styles.tdLg, //상태
                  startDate: styles.tdMd, //시작일
                  endDate: styles.tdMd, //종료일
                  ceoNm: styles.tdXl, //대표자명
                  email: styles.tdTextLeft, //이메일
                  usrTel: styles.tdXl, //전화번호
                  usrNm: `${styles.tdLg}`, //직원명(최대 5글자 길이)
                  survDesc: styles.tdTextLeft, //실사회차
                  assetNo: styles.tdTextLeft, //자산번호
                  eqpNm: styles.tdTextLeft, //장비명
                  eqpTy: styles.tdLg, //장비 구분
                  recNm: `${styles.tdLg}`, //보유 장비 사용자(최대 5글자 길이)
                  status: styles.tdHasSelect, //보유 장비 목록 상태
                  note: styles.tdHasSelect, //보유 장비 목록 비고
                  equipSt: styles.tdSm, //보유 장비 상태
                  chgDtm: styles.tdLg, //보유 장비 상태 변경일
                  survNo: styles.tdLg, // 보유 장비 실사번호
                  // survChkDtm: styles.tdMd, //보유 장비 실사일
                  survChkYn: styles.tdSm, //보유 장비 실사여부
                  tenantNm: styles.tdTextLeft, // 가입신청 관리
                  domainPath: styles.tdTextLeft, // 가입신청 도메인
                  ptnrNm: styles.tdTextLeft, // 협력사명
                  projectName: styles.tdTextLeft, // 프로젝트명
                  projectName: styles.tdXs, // 휴가 종류
                  vacRsn: `${styles.tdEllipsis} ${styles.tdMdMax}` // 휴가사유
                };

                return (
                  <td key={`${rowIndex}-${column.key}`} className={`${styles.td} ${tdClassMap[column.key] || ''}`}>
                    {rendered}
                  </td>
                );
              })}
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={columns.length} className={styles.tdEmpty}>
              {emptyMessage || '데이터가 없습니다.'}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default DataTable;
