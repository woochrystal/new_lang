/**
 * @fileoverview Partner API 서비스 (실제 백엔드 매칭)
 * @description Partner CRUD API 호출 (Pentaware SaaS 백엔드 연동)
 *
 * 데이터와 콜백을 하나의 객체로 통합
 * _onSuccess: 필수 (데이터 변환)
 * _onError: 선택 (에러 처리)
 */

import { apiClient, defaultErrorHandler } from '@/shared/api/client';
import LoggerFactory from '@/shared/lib/logger';

/**
 * API 베이스 엔드포인트
 * @type {string}
 */
const ENDPOINT = '/api/v1/partners';

const logger = LoggerFactory.getLogger('PartnerAPI');

/**
 * Partner API 서비스
 * 백엔드 API: http://localhost:8080/api/v1/partners
 * 인증: JWT 토큰 필요 (tenantId, userId 자동 추출)
 */
export const api = {
  /**
   * 협력사 목록을 조회합니다. (페이징, 검색 지원)
   * GET /api/v1/partners
   * @param {import('./schema').PartnerListQuery} [params={}] - 조회 파라미터
   * @returns {Promise<import('./entity').ApiPartnerList|null>} 협력사 목록 데이터 (실패 시 null)
   */
  async getList(params = {}) {
    const { data } = await apiClient.get(ENDPOINT, {
      params,
      _onSuccess: (response) => response.data
    });
    return data;
  },

  /**
   * 협력사를 생성합니다.
   * POST /api/v1/partners
   * @param {import('./schema').PartnerInput} partnerData - 협력사 데이터
   * @param {object} fileState - 파일 상태 (선택사항)
   * @param {number|null} fileState.fileId - FILE_ID
   * @param {Array} fileState.existing - 기존 파일 목록
   * @param {Array} fileState.new - 신규 파일 목록
   * @param {Array} fileState.deletedIds - 삭제된 파일 ID
   * @returns {Promise<number|null>} 생성된 협력사의 ID (실패 시 null)
   */
  async create(partnerData, fileState) {
    if (!partnerData) {
      logger.error(`[api.create] 협력사 등록 실패: partnerData가 null입니다.`);
      return null;
    }

    const formData = new FormData();

    // 데이터를 JSON Blob으로 추가
    const partnerBlob = new Blob([JSON.stringify(partnerData)], {
      type: 'application/json'
    });
    formData.append('partner', partnerBlob);

    // 파일 메타 정보 (파일이 있을 때만 추가)
    if (fileState && (fileState.new.length > 0 || fileState.existing.length > 0)) {
      const fileMeta = {
        fileId: fileState.fileId,
        deletedIds: fileState.deletedIds || [],
        shouldClearFiles:
          fileState.existing.length > 0 &&
          fileState.deletedIds.length === fileState.existing.length &&
          fileState.new.length === 0
      };
      const fileMetaBlob = new Blob([JSON.stringify(fileMeta)], {
        type: 'application/json'
      });
      formData.append('fileMeta', fileMetaBlob);
    }

    // 신규 파일들
    if (fileState && fileState.new && fileState.new.length > 0) {
      fileState.new.forEach((file) => {
        formData.append('files', file);
      });
    }

    const { data } = await apiClient.post(ENDPOINT, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      _onSuccess: (response) => {
        return response.status === 201 ? true : response.data;
      },
      _onError: (error) => {
        logger.error('협력사 생성 실패:', error);
        return defaultErrorHandler(error);
      }
    });
    return data;
  },

  /**
   * 특정 협력사의 상세 정보를 조회합니다.
   * GET /api/v1/partners/{id}
   * @param {number} id - 조회할 협력사의 ID
   * @returns {Promise<import('./entity').ApiPartner|null>} 협력사 상세 데이터 (실패 시 null)
   */
  async get(id) {
    const { data } = await apiClient.get(`${ENDPOINT}/${id}`, { _onSuccess: (response) => response.data });
    return data;
  },

  /**
   * 특정 협력사를 수정합니다.
   * PUT /api/v1/partners/{id}
   * @param {number} id - 수정할 협력사의 ID
   * @param {import('./schema').PartnerInput} partnerData - 수정할 데이터
   * @param {object} fileState - 파일 상태 (선택사항)
   * @param {number|null} fileState.fileId - FILE_ID
   * @param {Array} fileState.existing - 기존 파일 목록
   * @param {Array} fileState.new - 신규 파일 목록
   * @param {Array} fileState.deletedIds - 삭제된 파일 ID
   * @returns {Promise<import('./entity').ApiPartner|null>} 수정된 협력사 데이터 (실패 시 null)
   */
  async update(id, partnerData, fileState) {
    if (!partnerData) {
      logger.error(`[api.update] 협력사(ID: ${id}) 수정 실패: partnerData가 null입니다.`);
      return null;
    }

    const formData = new FormData();

    // 데이터를 JSON Blob으로 추가
    const partnerBlob = new Blob([JSON.stringify(partnerData)], {
      type: 'application/json'
    });
    formData.append('partner', partnerBlob);

    // 파일 메타 정보 (파일이 있을 때만 추가)
    if (fileState && (fileState.new.length > 0 || fileState.existing.length > 0)) {
      const fileMeta = {
        fileId: fileState.fileId,
        deletedIds: fileState.deletedIds || [],
        shouldClearFiles:
          fileState.existing.length > 0 &&
          fileState.deletedIds.length === fileState.existing.length &&
          fileState.new.length === 0
      };
      const fileMetaBlob = new Blob([JSON.stringify(fileMeta)], {
        type: 'application/json'
      });
      formData.append('fileMeta', fileMetaBlob);
    }

    // 신규 파일들
    if (fileState && fileState.new && fileState.new.length > 0) {
      fileState.new.forEach((file) => {
        formData.append('files', file);
      });
    }

    const { data } = await apiClient.put(`${ENDPOINT}/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      _onSuccess: (response) => response.data,
      _onError: (error) => {
        logger.error(`[api.update] 협력사(ID: ${id}) 수정 실패:`, error);
        return defaultErrorHandler(error);
      }
    });
    return data;
  },

  /**
   * 특정 협력사를 삭제합니다.
   * DELETE /api/v1/partners/{id}
   * @param {number} id - 삭제할 협력사의 ID
   * @returns {Promise<boolean>} 삭제 성공 여부
   */
  async delete(id) {
    const { error } = await apiClient.delete(`${ENDPOINT}/${id}`, {
      _onSuccess: () => true,
      _onError: (error) => {
        logger.error(`[api.delete] 협력사(ID: ${id}) 삭제 실패:`, error);
        return defaultErrorHandler(error);
      }
    });
    return !error;
  }
};
