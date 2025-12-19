/**
 * @fileoverview VacCnt 관련 Entity 클래스 및 API 타입 정의
 * @description API 응답을 도메인 엔티티로 변환하는 클래스들
 */

import { VACCNT_CONSTANTS } from './constants';
import { formatDecimal, calculateRemainingDays } from './utils';

// ============================================
// API 응답 타입 정의
// ============================================

/**
 * API 응답 - 휴가일수 단일 항목
 * @typedef {Object} ApiVacCnt
 * @property {number} vacCntId - 휴가일수 고유 ID
 * @property {string} empName - 직원명
 * @property {number} year - 기준년도
 * @property {number} usedVacationDays - 휴가 사용일
 * @property {number} totalVacationDays - 총 휴가 일수
 * @property {string} quitDt - 퇴사일 (직원 구분 판단용)
 * @property {string} regDtm - 생성일시 (ISO 8601 형식)
 * @property {string} updDtm - 수정일시 (ISO 8601 형식)
 */

/**
 * API 응답 - 휴가일수 목록
 * @typedef {Object} ApiVacCntList
 * @property {ApiVacCnt[]} list - 휴가일수 목록
 * @property {number} page - 현재 페이지 번호
 * @property {number} size - 페이지 크기
 * @property {number} totalCount - 전체 항목 수
 * @property {number} totalPages - 전체 페이지 수
 */

// ============================================
// 도메인 엔티티 타입 정의
// ============================================

/**
 * 도메인 엔티티 - 휴가일수
 * @typedef {Object} VacCntEntity
 * @property {number} id - 휴가일수 고유 ID
 * @property {string} empName - 직원명
 * @property {number} year - 기준년도
 * @property {number} usedVacationDays - 휴가 사용일
 * @property {number} totalVacationDays - 총 휴가 일수
 * @property {number} remainingVacationDays - 남은 휴가 일수 (계산값)
 * @property {string} empStatus - 직원 구분 (재직/퇴사)
 * @property {string} createdAt - 생성일시 (ISO 8601 형식)
 * @property {string} updatedAt - 수정일시 (ISO 8601 형식)
 */

/**
 * 도메인 엔티티 - 페이지네이션 정보
 * @typedef {Object} PaginationEntity
 * @property {number} currentPage - 현재 페이지 번호
 * @property {number} totalPages - 전체 페이지 수
 * @property {number} pageSize - 페이지 크기
 * @property {number} totalCount - 전체 항목 수
 */

/**
 * 도메인 엔티티 - 휴가일수 목록 (페이지네이션 포함)
 * @typedef {Object} VacCntListEntity
 * @property {VacCntEntity[]} list - 휴가일수 목록
 * @property {PaginationEntity} pagination - 페이지네이션 정보
 */

/**
 * 휴가일수 Entity 클래스
 * API 응답을 도메인 모델로 변환
 */
export class VacCnt {
  /**
   * 백엔드 API 응답을 도메인 모델로 변환
   * @param {ApiVacCnt} apiData - 백엔드 API 응답 데이터
   * @returns {VacCntEntity} 변환된 도메인 모델
   */
  static fromApi(apiData) {
    if (!apiData) {
      throw new Error('VacCnt.fromApi: apiData가 필요합니다.');
    }

    // 백엔드 응답 키 호환 처리
    // - 총휴가일수: totalVacationDays | TOT_VAC | totVac | tot_vac
    // - 사용휴가일수: usedVacationDays | USE_VAC | useVac | use_vac
    // - 연도: year | baseYr | BASE_YR | yr
    // - ID: vacCntId | id | VAC_CNT_ID
    // - 직원명: empName | EMP_NAME | empNm | EMP_NM
    const totalDays = Number(apiData.totalVacationDays ?? apiData.TOT_VAC ?? apiData.totVac ?? apiData.tot_vac) || 0;
    const usedDays = Number(apiData.usedVacationDays ?? apiData.USE_VAC ?? apiData.useVac ?? apiData.use_vac) || 0;

    // year를 숫자로 변환 (백엔드가 문자열로 보낼 수 있음)
    const yearValue = apiData.year ?? apiData.baseYr ?? apiData.BASE_YR ?? apiData.yr;
    const year = yearValue ? Number(yearValue) : new Date().getFullYear();

    // 재직상태: 백엔드에서 계산된 값 사용 (quitDt 기반 계산 제거)
    const empStatus = apiData.empStatus ?? apiData.EMP_STATUS ?? apiData.emp_status ?? '재직';

    // 계약구분: 백엔드에서 직접 제공 (FULL/CONT/PART 코드)
    const empTy = apiData.empTy ?? apiData.EMP_TY ?? apiData.emp_ty ?? '';

    const result = {
      id: apiData.vacCntId ?? apiData.id ?? apiData.VAC_CNT_ID,
      empName:
        apiData.empName ??
        apiData.usrName ??
        apiData.EMP_NAME ??
        apiData.USR_NM ??
        apiData.empNm ??
        apiData.EMP_NM ??
        '',
      year,
      usedVacationDays: usedDays,
      totalVacationDays: totalDays,
      remainingVacationDays: calculateRemainingDays(totalDays, usedDays),
      empStatus, // 재직상태 (재직/퇴사/입사예정)
      empType: empTy, // 계약구분 (FULL/CONT/PART)
      createdAt: apiData.regDtm || '',
      updatedAt: apiData.updDtm || apiData.regDtm || ''
    };

    return result;
  }

  /**
   * 휴가일수 목록을 변환
   * @param {ApiVacCnt[]} apiList - 백엔드 API 응답 목록
   * @returns {VacCntEntity[]} 변환된 도메인 모델 목록
   */
  static fromApiList(apiList) {
    if (!Array.isArray(apiList)) {
      throw new Error('VacCnt.fromApiList: apiList는 배열이어야 합니다.');
    }

    return apiList.map((item) => VacCnt.fromApi(item));
  }

  /**
   * 테이블 표시용 데이터로 변환
   * @param {VacCntEntity} vacCnt - 도메인 모델
   * @param {number} rowNumber - 행 번호
   * @returns {Object} 테이블 표시용 데이터
   */
  static toTableRow(vacCnt, rowNumber) {
    return {
      id: vacCnt.id,
      rowNumber,
      empName: vacCnt.empName,
      year: vacCnt.year,
      usedVacationDays: formatDecimal(vacCnt.usedVacationDays),
      totalVacationDays: formatDecimal(vacCnt.totalVacationDays),
      empStatus: vacCnt.empStatus, // 재직상태 (재직/퇴사/입사예정)
      empType: vacCnt.empType ? VACCNT_CONSTANTS.EMP_TYPE[vacCnt.empType] || vacCnt.empType : '', // 계약구분 코드 → 한글
      originalItem: vacCnt
    };
  }

  /**
   * 도메인 모델을 API 요청 데이터로 변환
   * @param {VacCntEntity} vacCnt - 도메인 모델
   * @returns {Object} API 요청 데이터
   */
  static toApiRequest(vacCnt) {
    // 백엔드가 기대하는 필드명으로 변환
    // year → baseYr
    return {
      empName: vacCnt.empName,
      baseYr: Number(vacCnt.year), // year → baseYr 변환
      usedVacationDays: Number(vacCnt.usedVacationDays),
      totalVacationDays: Number(vacCnt.totalVacationDays)
    };
  }
}

/**
 * 페이지네이션 Entity 클래스
 * API 응답을 페이지네이션 모델로 변환
 */
export class Pagination {
  /**
   * 백엔드 API 응답을 페이지네이션 모델로 변환
   * @param {Object} apiData - API 응답의 페이지네이션 데이터
   * @param {number} apiData.page - 현재 페이지
   * @param {number} apiData.size - 페이지 크기
   * @param {number} apiData.totalCount - 전체 항목 수
   * @param {number} apiData.totalPages - 전체 페이지 수
   * @returns {PaginationEntity} 변환된 페이지네이션 모델
   */
  static fromApi(apiData) {
    if (!apiData) {
      throw new Error('Pagination.fromApi: apiData가 필요합니다.');
    }

    // 배열인 경우 기본 페이지네이션 반환
    if (Array.isArray(apiData)) {
      return {
        currentPage: 1,
        totalPages: 1,
        pageSize: apiData.length,
        totalCount: apiData.length
      };
    }

    // Spring Data Page 객체 지원
    let currentPage = 1;
    if (apiData.page !== undefined) {
      currentPage = apiData.page;
    } else if (apiData.number !== undefined) {
      currentPage = apiData.number + 1;
    }

    const totalPages = apiData.totalPages || 1;
    const pageSize = apiData.size || 10;

    let totalCount = 0;
    if (apiData.totalCount !== undefined) {
      // eslint-disable-next-line prefer-destructuring
      totalCount = apiData.totalCount;
    } else if (apiData.totalElements !== undefined) {
      totalCount = apiData.totalElements;
    }

    return {
      currentPage,
      totalPages,
      pageSize,
      totalCount
    };
  }

  /**
   * 이전 페이지 존재 여부
   * @param {PaginationEntity} pagination
   * @returns {boolean}
   */
  static hasPrevious(pagination) {
    return pagination.currentPage > 1;
  }

  /**
   * 다음 페이지 존재 여부
   * @param {PaginationEntity} pagination
   * @returns {boolean}
   */
  static hasNext(pagination) {
    return pagination.currentPage < pagination.totalPages;
  }
}

/**
 * 휴가일수 목록 Entity 클래스
 * API 응답을 휴가일수 목록 모델로 변환
 */
export class VacCntList {
  /**
   * 백엔드 API 응답을 도메인 모델로 변환
   * @param {ApiVacCntList} apiData - 백엔드 API 응답 데이터
   * @returns {VacCntListEntity} 변환된 도메인 모델
   */
  static fromApi(apiData) {
    if (!apiData) {
      throw new Error('VacCntList.fromApi: apiData가 필요합니다.');
    }

    // 다양한 응답 구조 지원
    let listData = [];

    // 1. apiData.list (우리가 정의한 구조)
    if (apiData.list && Array.isArray(apiData.list)) {
      listData = apiData.list;
    }
    // 2. apiData.content (Spring Data Page 객체)
    else if (apiData.content && Array.isArray(apiData.content)) {
      listData = apiData.content;
    }
    // 3. apiData.data (일반적인 응답 구조)
    else if (apiData.data && Array.isArray(apiData.data)) {
      listData = apiData.data;
    }
    // 4. apiData 자체가 배열
    else if (Array.isArray(apiData)) {
      listData = apiData;
    }
    // 5. 그 외의 경우 에러
    else {
      console.error('VacCntList.fromApi: 알 수 없는 응답 구조:', apiData);
      throw new Error('VacCntList.fromApi: apiData에서 목록을 찾을 수 없습니다.');
    }

    return {
      list: VacCnt.fromApiList(listData),
      pagination: Pagination.fromApi(apiData)
    };
  }
}
