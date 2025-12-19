/**
 * @fileoverview 프로젝트관리 관련 Entity 클래스 및 API 타입 정의
 * @description API 응답을 도메인 엔티티로 변환하는 클래스들
 */

import { formatDate } from './utils';

// ============================================
// API 응답 타입 정의
// ============================================

/**
 * API 응답 - 프로젝트 단일 항목
 * @typedef {Object} ApiProject
 * @property {number} prjId - 프로젝트 ID
 * @property {number} tenantId - 테넌트 ID
 * @property {string} prjNm - 프로젝트명
 * @property {string} prjStaDt - 프로젝트 시작일 (ISO 8601)
 * @property {string} prjEndDt - 프로젝트 종료일 (ISO 8601)
 * @property {string} prjSt - 프로젝트 상태
 * @property {string} prjClient - 고객사
 * @property {string} prjLoc - 장소
 * @property {string} prjMemo - 비고
 * @property {number} fileId - 파일 ID
 * @property {Array} members - 프로젝트 멤버 목록
 * @property {number} regId - 등록자 ID
 * @property {string} regDtm - 등록일시
 * @property {number} updId - 수정자 ID
 * @property {string} updDtm - 수정일시
 * @property {string} regUsrName - 등록자명
 * @property {string} updUsrName - 수정자명
 */

/**
 * API 응답 - 프로젝트 목록 (페이지네이션)
 * @typedef {Object} ApiProjectList
 * @property {ApiProject[]} list - 프로젝트 목록
 * @property {number} page - 현재 페이지 번호
 * @property {number} size - 페이지 크기
 * @property {number} totalCount - 전체 항목 수
 * @property {number} totalPages - 전체 페이지 수
 */

// ============================================
// 도메인 엔티티 타입 정의
// ============================================

/**
 * 도메인 엔티티 - 프로젝트
 * @typedef {Object} ProjectEntity
 * @property {number} id - 프로젝트 ID
 * @property {string} projectName - 프로젝트명
 * @property {string} startDate - 시작일 (ISO 8601)
 * @property {string} endDate - 종료일 (ISO 8601)
 * @property {string} status - 프로젝트 상태
 * @property {string} client - 고객사
 * @property {string} location - 장소
 * @property {string} memo - 비고
 * @property {number} fileId - 파일 ID
 * @property {Array} members - 프로젝트 멤버 목록
 * @property {string} registrant - 등록자명
 * @property {string} updater - 수정자명
 */

/**
 * 프로젝트 Entity 클래스
 * API 응답을 도메인 모델로 변환
 */
export class Project {
  /**
   * 백엔드 API 응답을 도메인 모델로 변환
   * @param {ApiProject} apiData - 백엔드 API 응답 데이터
   * @returns {ProjectEntity} 변환된 도메인 모델
   */
  static fromApi(apiData) {
    if (!apiData) {
      throw new Error('Project.fromApi: apiData가 필요합니다.');
    }

    return {
      id: apiData.prjId,
      projectName: apiData.prjNm || '',
      startDate: apiData.prjStaDt || '',
      endDate: apiData.prjEndDt || '',
      status: apiData.prjSt || '',
      client: apiData.prjClient || '',
      location: apiData.prjLoc || '',
      memo: apiData.prjMemo || '',
      fileId: apiData.fileId || null,
      fileList: Array.isArray(apiData.fileList) ? apiData.fileList : [],
      members: Array.isArray(apiData.members)
        ? apiData.members.map((member) => ({
            prjMbrId: member.prjMbrId,
            mbrId: member.mbrId,
            mbrNm: member.mbrNm || '',
            mbrEmpYn: member.mbrId ? 'Y' : 'N',
            mbrTask: member.mbrTask || '',
            mbrStaDt: member.mbrStaDt || null,
            mbrEndDt: member.mbrEndDt || null,
            mbrMmnth: member.mbrMmnth || ''
          }))
        : [],
      registrant: apiData.regUsrName || '',
      updater: apiData.updUsrName || ''
    };
  }

  /**
   * 프로젝트 목록을 변환
   * @param {ApiProject[]} apiList - 백엔드 API 응답 목록
   * @returns {ProjectEntity[]} 변환된 도메인 모델 목록
   */
  static fromApiList(apiList) {
    if (!Array.isArray(apiList)) {
      throw new Error('Project.fromApiList: apiList는 배열이어야 합니다.');
    }

    return apiList.map((item) => Project.fromApi(item));
  }

  /**
   * 도메인 모델을 API 요청 데이터로 변환
   * @param {ProjectEntity} project - 도메인 모델
   * @returns {Object} API 요청 데이터
   */
  static toApi(project) {
    return {
      prjNm: project.projectName,
      prjStaDt: project.startDate,
      prjEndDt: project.endDate || null,
      prjSt: project.status,
      prjClient: project.client || null,
      prjLoc: project.location || null,
      prjMemo: project.memo || null,
      fileId: project.fileId || null,
      prjEmpAuth: project.empAuth || null,
      prjDesign: project.design || null,
      members: project.members || []
    };
  }

  /**
   * 테이블 표시용 데이터로 변환
   * @param {ProjectEntity} project - 도메인 모델
   * @param {number} rowNumber - 행 번호
   * @returns {Object} 테이블 표시용 데이터
   */
  static toTableRow(project, rowNumber) {
    return {
      id: project.id,
      rowNumber,
      client: project.client,
      projectName: project.projectName,
      status: project.status,
      startDate: formatDate(project.startDate),
      endDate: formatDate(project.endDate),
      originalItem: project
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
   * @returns {Object} 변환된 페이지네이션 모델
   */
  static fromApi(apiData) {
    if (!apiData) {
      throw new Error('Pagination.fromApi: apiData가 필요합니다.');
    }

    return {
      currentPage: apiData.page || 1,
      totalPages: apiData.totalPages || 1,
      pageSize: apiData.size || 10,
      totalCount: apiData.totalCount || 0
    };
  }

  /**
   * 이전 페이지 존재 여부
   * @param {Object} pagination
   * @returns {boolean}
   */
  static hasPrevious(pagination) {
    return pagination.currentPage > 1;
  }

  /**
   * 다음 페이지 존재 여부
   * @param {Object} pagination
   * @returns {boolean}
   */
  static hasNext(pagination) {
    return pagination.currentPage < pagination.totalPages;
  }
}

/**
 * 프로젝트 목록 Entity 클래스
 * API 응답을 프로젝트 목록 모델로 변환
 */
export class ProjectList {
  /**
   * 백엔드 API 응답을 도메인 모델로 변환
   * @param {ApiProjectList} apiData - 백엔드 API 응답 데이터
   * @returns {Object} 변환된 도메인 모델 { list, pagination }
   */
  static fromApi(apiData) {
    if (!apiData) {
      throw new Error('ProjectList.fromApi: apiData가 필요합니다.');
    }

    if (!Array.isArray(apiData.list)) {
      throw new Error('ProjectList.fromApi: apiData.list는 배열이어야 합니다.');
    }

    return {
      list: Project.fromApiList(apiData.list),
      pagination: Pagination.fromApi(apiData)
    };
  }
}
