/**
 * @fileoverview 프로젝트현황 관련 Entity 클래스 및 API 타입 정의
 * @description API 응답을 도메인 엔티티로 변환하는 클래스들
 */

import { WORK_CONSTANTS } from './constants';
import { formatDate } from './utils';

// ============================================
// API 응답 타입 정의
// ============================================

/**
 * API 응답 - 프로젝트현황 단일 항목
 * @typedef {Object} ApiWork
 * @property {number} rowNum - 순번
 * @property {number} prjId - 프로젝트 ID
 * @property {string} prjNm - 프로젝트명
 * @property {string} prjClient - 고객사
 * @property {string} prjStaDt - 프로젝트 시작일 (ISO 8601)
 * @property {string} prjEndDt - 프로젝트 종료일 (ISO 8601)
 * @property {string} period - 기간 (시작일~종료일 문자열)
 * @property {string} mbrMmnth - 투입개월수
 * @property {string} mbrTask - 업무 (구성원 업무)
 * @property {string} prjLoc - 프로젝트 수행장소
 * @property {string} prjSt - 프로젝트 상태
 * @property {number} prjMbrId - 프로젝트 멤버 ID
 * @property {number} mbrId - 구성원 ID
 * @property {string} mbrNm - 구성원명
 * @property {string} mbrStaDt - 구성원 시작일 (ISO 8601)
 * @property {string} mbrEndDt - 구성원 종료일 (ISO 8601)
 */

/**
 * API 응답 - 프로젝트현황 목록
 * @typedef {Object} ApiWorkList
 * @property {ApiWork[]} list - 프로젝트현황 목록
 * @property {number} page - 현재 페이지 번호
 * @property {number} size - 페이지 크기
 * @property {number} totalCount - 전체 항목 수
 * @property {number} totalPages - 전체 페이지 수
 * @property {Object} [metadata] - 메타데이터 (권한 정보 등)
 * @property {string[]} [metadata.permissions] - 권한 목록
 */

// ============================================
// 도메인 엔티티 타입 정의
// ============================================

/**
 * 도메인 엔티티 - 프로젝트현황
 * @typedef {Object} WorkEntity
 * @property {number} id - 프로젝트 멤버 ID (고유 식별자)
 * @property {number} projectId - 프로젝트 ID
 * @property {string} projectName - 프로젝트명
 * @property {string} client - 고객사
 * @property {string} startDate - 투입일 (ISO 8601)
 * @property {string} endDate - 철수일 (ISO 8601)
 * @property {string} location - 수행장소
 * @property {string} task - 업무
 * @property {string} months - 투입개월수
 * @property {string} status - 프로젝트 상태
 * @property {number} memberId - 구성원 ID
 * @property {string} memberName - 구성원명
 * @property {string} projectStartDate - 프로젝트 시작일
 * @property {string} projectEndDate - 프로젝트 종료일
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
 * 도메인 엔티티 - 프로젝트현황 목록 (페이지네이션 포함)
 * @typedef {Object} WorkListEntity
 * @property {WorkEntity[]} list - 프로젝트현황 목록
 * @property {PaginationEntity} pagination - 페이지네이션 정보
 */

/**
 * 프로젝트현황 Entity 클래스
 * API 응답을 도메인 모델로 변환
 */
export class Work {
  /**
   * 백엔드 API 응답을 도메인 모델로 변환
   * @param {ApiWork} apiData - 백엔드 API 응답 데이터
   * @returns {WorkEntity} 변환된 도메인 모델
   */
  static fromApi(apiData) {
    if (!apiData) {
      throw new Error('Work.fromApi: apiData가 필요합니다.');
    }

    return {
      id: apiData.prjMbrId,
      projectId: apiData.prjId,
      projectName: apiData.prjNm || '',
      client: apiData.prjClient || '',
      startDate: apiData.mbrStaDt || '',
      endDate: apiData.mbrEndDt || '',
      location: apiData.prjLoc || '',
      task: apiData.mbrTask || '',
      months: apiData.mbrMmnth || '',
      status: apiData.prjSt || '',
      memberId: apiData.mbrId,
      memberName: apiData.mbrNm || '',
      projectStartDate: apiData.prjStaDt || '',
      projectEndDate: apiData.prjEndDt || ''
    };
  }

  /**
   * 프로젝트현황 목록을 변환
   * @param {ApiWork[]} apiList - 백엔드 API 응답 목록
   * @returns {WorkEntity[]} 변환된 도메인 모델 목록
   */
  static fromApiList(apiList) {
    if (!Array.isArray(apiList)) {
      throw new Error('Work.fromApiList: apiList는 배열이어야 합니다.');
    }

    return apiList.map((item) => Work.fromApi(item));
  }

  /**
   * 테이블 표시용 데이터로 변환
   * @param {WorkEntity} work - 도메인 모델
   * @param {number} rowNumber - 행 번호
   * @returns {Object} 테이블 표시용 데이터
   */
  static toTableRow(work, rowNumber) {
    return {
      id: work.id,
      rowNumber,
      memberName: work.memberName,
      client: work.client,
      projectName: work.projectName,
      status: work.status,
      startDate: formatDate(work.startDate),
      endDate: formatDate(work.endDate),
      location: work.location,
      originalItem: work
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

    return {
      currentPage: apiData.page || 1,
      totalPages: apiData.totalPages || 1,
      pageSize: apiData.size || WORK_CONSTANTS.DEFAULT_PAGE_SIZE,
      totalCount: apiData.totalCount || 0
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
 * 프로젝트현황 목록 Entity 클래스
 * API 응답을 프로젝트현황 목록 모델로 변환
 */
export class WorkList {
  /**
   * 백엔드 API 응답을 도메인 모델로 변환
   * @param {ApiWorkList} apiData - 백엔드 API 응답 데이터
   * @returns {WorkListEntity} 변환된 도메인 모델
   */
  static fromApi(apiData) {
    if (!apiData) {
      throw new Error('WorkList.fromApi: apiData가 필요합니다.');
    }

    if (!Array.isArray(apiData.list)) {
      throw new Error('WorkList.fromApi: apiData.list는 배열이어야 합니다.');
    }

    return {
      list: Work.fromApiList(apiData.list),
      pagination: Pagination.fromApi(apiData)
    };
  }
}
