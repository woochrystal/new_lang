/**
 * @fileoverview 프로젝트관리 API 서비스
 * @description 프로젝트 CRUD 및 검색 API 호출
 */

import { apiClient } from '@/shared/api/client';

/**
 * API 베이스 엔드포인트
 * @type {string}
 */
const ENDPOINT = '/api/v1/projects';

/**
 * 프로젝트관리 API 서비스
 * 백엔드 API: /api/v1/projects
 * 인증: JWT 토큰 필요 (tenantId, userId 자동 추출)
 */
export const api = {
  /**
   * 프로젝트 목록을 조회합니다.
   * GET /api/v1/projects
   * @returns {Promise<Array|null>} 프로젝트 목록 (실패 시 null)
   */
  async getList() {
    const { data } = await apiClient.get(ENDPOINT, {
      _onSuccess: (response) => response.data
    });
    return data;
  },

  /**
   * 검색 조건에 따른 프로젝트 목록을 조회합니다. (페이징, 검색 지원)
   * POST /api/v1/projects/search
   * @param {Object} [params={}] - 검색 파라미터
   * @param {string} [params.searchKeyword] - 검색 키워드
   * @param {string} [params.searchType] - 검색 타입 (prjNm/prjClient/prjLoc)
   * @param {string} [params.prjSt] - 프로젝트 상태 (진행중/완료/보류/취소)
   * @param {string} [params.startDate] - 시작일 검색 시작 (YYYY-MM-DD)
   * @param {string} [params.endDate] - 종료일 검색 종료 (YYYY-MM-DD)
   * @param {number} [params.page=1] - 페이지 번호
   * @param {number} [params.size=10] - 페이지 크기
   * @param {string} [params.sortBy=regDtm] - 정렬 기준
   * @param {string} [params.sortOrder=DESC] - 정렬 순서 (ASC/DESC)
   * @returns {Promise<Object|null>} 검색 결과 (list, page, size, totalCount, totalPages) 또는 null
   */
  async search(params = {}) {
    const { data } = await apiClient.post(`${ENDPOINT}/search`, params, {
      _onSuccess: (response) => response.data
    });
    return data;
  },

  /**
   * 특정 프로젝트 상세 정보를 조회합니다.
   * GET /api/v1/projects/{prjId}
   * @param {number} prjId - 프로젝트 ID
   * @returns {Promise<Object|null>} 프로젝트 상세 정보 (실패 시 null)
   */
  async get(prjId) {
    const { data } = await apiClient.get(`${ENDPOINT}/${prjId}`, {
      _onSuccess: (response) => response.data
    });
    return data;
  },

  /**
   * 새 프로젝트를 등록합니다.
   * POST /api/v1/projects
   * @param {Object} projectData - 프로젝트 등록 데이터
   * @param {string} projectData.prjNm - 프로젝트명 (필수, 2-50자)
   * @param {string} projectData.prjStaDt - 프로젝트 시작일 (필수, YYYY-MM-DD)
   * @param {string} [projectData.prjEndDt] - 프로젝트 종료일 (YYYY-MM-DD)
   * @param {string} projectData.prjSt - 프로젝트 상태 (필수, 진행중/완료/보류/취소)
   * @param {string} [projectData.prjClient] - 고객사명 (최대 50자)
   * @param {string} [projectData.prjLoc] - 프로젝트 장소 (최대 50자)
   * @param {string} [projectData.prjMemo] - 프로젝트 비고 (최대 100자)
   * @param {number} [projectData.fileId] - 파일 ID
   * @param {string} [projectData.prjEmpAuth] - 직원인증
   * @param {string} [projectData.prjEmpYn] - 직원여부 (Y/N)
   * @param {string} [projectData.prjWorkDiv] - 업무구분
   * @param {string} [projectData.prjDesign] - 디자인
   * @param {number} [projectData.prjMm] - 투입공수(M/M)
   * @param {string} [projectData.prjTechGrade] - 기술자등급
   * @param {Object} [fileState] - 파일 상태 (선택사항)
   * @param {number|null} fileState.fileId - FILE_ID
   * @param {Array} fileState.existing - 기존 파일 목록
   * @param {Array} fileState.new - 신규 파일 목록
   * @param {Array} fileState.deletedIds - 삭제된 파일 ID
   * @returns {Promise<Object|null>} 등록된 프로젝트 정보 (실패 시 null)
   */
  async create(projectData, fileState) {
    if (!projectData) {
      console.error('[api.create] 프로젝트 등록 실패: projectData가 null입니다.');
      return null;
    }

    const formData = new FormData();

    // 1. 프로젝트 데이터 (JSON Blob)
    const projectBlob = new Blob([JSON.stringify(projectData)], {
      type: 'application/json'
    });
    formData.append('project', projectBlob);

    // 2. 파일 메타 정보
    if (fileState && (fileState.new.length > 0 || fileState.existing.length > 0)) {
      const fileMeta = {
        fileId: fileState.fileId,
        deletedIds: fileState.deletedIds || [],
        shouldClearFiles:
          fileState.existing.length > 0 &&
          fileState.deletedIds.length === fileState.existing.length &&
          fileState.new.length === 0
      };
      formData.append('fileMeta', new Blob([JSON.stringify(fileMeta)], { type: 'application/json' }));
    }

    // 3. 신규 파일들
    if (fileState && fileState.new && fileState.new.length > 0) {
      fileState.new.forEach((file) => {
        formData.append('files', file);
      });
    }

    const { data, error } = await apiClient.post(ENDPOINT, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      _onSuccess: (response) => response.data
    });

    if (error) {
      throw error;
    }
    return data;
  },

  /**
   * 기존 프로젝트 정보를 수정합니다.
   * PUT /api/v1/projects/{prjId}
   * @param {number} prjId - 프로젝트 ID
   * @param {Object} projectData - 수정할 프로젝트 데이터 (create와 동일한 구조)
   * @param {Object} [fileState] - 파일 상태 (선택사항)
   * @param {number|null} fileState.fileId - FILE_ID
   * @param {Array} fileState.existing - 기존 파일 목록
   * @param {Array} fileState.new - 신규 파일 목록
   * @param {Array} fileState.deletedIds - 삭제된 파일 ID
   * @returns {Promise<Object|null>} 수정된 프로젝트 정보 (실패 시 null)
   */
  async update(prjId, projectData, fileState) {
    if (!projectData) {
      console.error(`[api.update] 프로젝트(ID: ${prjId}) 수정 실패: projectData가 null입니다.`);
      return null;
    }

    const formData = new FormData();

    // 1. 프로젝트 데이터 (JSON Blob)
    const projectBlob = new Blob([JSON.stringify(projectData)], {
      type: 'application/json'
    });
    formData.append('project', projectBlob);

    // 2. 파일 메타 정보
    if (fileState && (fileState.new.length > 0 || fileState.existing.length > 0)) {
      const fileMeta = {
        fileId: fileState.fileId,
        deletedIds: fileState.deletedIds || [],
        shouldClearFiles:
          fileState.existing.length > 0 &&
          fileState.deletedIds.length === fileState.existing.length &&
          fileState.new.length === 0
      };
      formData.append('fileMeta', new Blob([JSON.stringify(fileMeta)], { type: 'application/json' }));
    }

    // 3. 신규 파일들
    if (fileState && fileState.new && fileState.new.length > 0) {
      fileState.new.forEach((file) => {
        formData.append('files', file);
      });
    }

    const { data, error } = await apiClient.put(`${ENDPOINT}/${prjId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      _onSuccess: (response) => response.data
    });

    if (error) {
      throw error;
    }
    return data;
  },

  /**
   * 프로젝트를 삭제합니다. (논리적 삭제)
   * DELETE /api/v1/projects/{prjId}
   * @param {number} prjId - 프로젝트 ID
   * @returns {Promise<boolean>} 삭제 성공 여부
   */
  async delete(prjId) {
    const { data, error } = await apiClient.delete(`${ENDPOINT}/${prjId}`, {
      _onSuccess: () => true
    });
    return !error && data === true;
  },

  /**
   * 현재 테넌트의 직원 목록을 조회합니다.
   * GET /api/v1/sys/employees/search
   * @returns {Promise<Array|null>} 직원 목록 (실패 시 null)
   * 응답 예시: { list: [{ empId: 1, name: '홍길동', department: '개발팀', position: '대리' }] }
   */
  async getEmployeeList() {
    const { data } = await apiClient.get('/api/v1/sys/employees/search', {
      params: {
        page: 1,
        size: 1000 // 전체 직원 조회
      },
      _onSuccess: (response) => {
        // list 배열만 반환
        return response.data?.list || [];
      },
      _onError: () => {
        // API 실패 시 빈 배열 반환
        return [];
      }
    });
    return data;
  }
};
