/**
 * @fileoverview Notice API 서비스
 * @description 공지사항 CRUD API 호출
 */

import { apiClient, defaultErrorHandler } from '@/shared/api/client';
import LoggerFactory from '@/shared/lib/logger';

const USER_ENDPOINT = '/api/v1/notices';
const ADMIN_ENDPOINT = '/api/v1/admin/notices';
const logger = LoggerFactory.getLogger('NoticeAPI');

export const noticeApi = {
  /**
   * 공지사항 목록을 조회합니다. (페이징, 검색 지원)
   * GET /api/v1/notices
   * @param {object} [config={}] - axios 요청 설정 객체 (params 포함)
   * @returns {Promise<object|null>} 공지사항 목록 데이터 (실패 시 null)
   */
  async getList(config = {}) {
    const { data } = await apiClient.get(USER_ENDPOINT, {
      ...config,
      _onSuccess: (response) => response.data,
      _onError: (error) => {
        logger.error('공지사항 목록 조회 실패:', error);
        return defaultErrorHandler(error);
      }
    });
    return data;
  },

  /**
   * 특정 공지사항의 상세 정보를 조회합니다.
   * GET /api/v1/notices/{id}
   * @param {number} id - 조회할 공지사항의 ID
   * @returns {Promise<object|null>} 공지사항 상세 데이터 (실패 시 null)
   */
  async get(id) {
    const { data } = await apiClient.get(`${USER_ENDPOINT}/${id}`, {
      _onSuccess: (response) => response.data
    });
    return data;
  },

  /**
   * 새로운 공지사항을 등록합니다. (관리자용)
   * POST /api/v1/admin/notices
   * @param {object} noticeData - 등록할 공지사항 데이터
   * @param {object} fileState - 파일 상태 (선택사항)
   * @param {number|null} fileState.fileId - FILE_ID
   * @param {Array} fileState.existing - 기존 파일 목록
   * @param {Array} fileState.new - 신규 파일 목록
   * @param {Array} fileState.deletedIds - 삭제된 파일 ID
   * @returns {Promise<number|null>} 생성된 공지사항 ID (실패 시 null)
   */
  async create(noticeData, fileState) {
    const formData = new FormData();

    // 1. notice 데이터를 JSON Blob으로 추가
    const noticeBlob = new Blob([JSON.stringify(noticeData)], {
      type: 'application/json'
    });
    formData.append('notice', noticeBlob);

    // 2. 파일 메타 정보 (파일이 있을 때만 추가)
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

    // 3. 신규 파일들
    if (fileState && fileState.new && fileState.new.length > 0) {
      fileState.new.forEach((file) => {
        formData.append('files', file);
      });
    }

    const { data } = await apiClient.post(ADMIN_ENDPOINT, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      _onSuccess: (response) => response.data,
      _onError: (error) => {
        logger.error('공지사항 등록 실패:', error);
        return defaultErrorHandler(error);
      }
    });
    return data;
  },

  /**
   * 기존 공지사항을 수정합니다. (관리자용)
   * PUT /api/v1/admin/notices/{id}
   * @param {number} id - 수정할 공지사항 ID
   * @param {object} noticeData - 수정할 공지사항 데이터
   * @param {object} fileState - 파일 상태 (선택사항)
   * @param {number|null} fileState.fileId - FILE_ID
   * @param {Array} fileState.existing - 기존 파일 목록
   * @param {Array} fileState.new - 신규 파일 목록
   * @param {Array} fileState.deletedIds - 삭제된 파일 ID
   * @returns {Promise<object|null>} 수정된 공지사항 데이터 (실패 시 null)
   */
  async update(id, noticeData, fileState) {
    const formData = new FormData();

    // 1. notice 데이터를 JSON Blob으로 추가
    const noticeBlob = new Blob([JSON.stringify(noticeData)], {
      type: 'application/json'
    });
    formData.append('notice', noticeBlob);

    // 2. 파일 메타 정보 (파일이 있을 때만 추가)
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

    // 3. 신규 파일들
    if (fileState && fileState.new && fileState.new.length > 0) {
      fileState.new.forEach((file) => {
        formData.append('files', file);
      });
    }

    const { data } = await apiClient.put(`${ADMIN_ENDPOINT}/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      _onSuccess: (response) => response.data,
      _onError: (error) => {
        logger.error(`공지사항(ID: ${id}) 수정 실패:`, error);
        return defaultErrorHandler(error);
      }
    });
    return data;
  },

  /**
   * 공지사항을 삭제합니다. (관리자용)
   * DELETE /api/v1/admin/notices/{id}
   * @param {number} id - 삭제할 공지사항 ID
   * @returns {Promise<boolean>} 삭제 성공 여부
   */
  async delete(id) {
    const { error } = await apiClient.delete(`${ADMIN_ENDPOINT}/${id}`, {
      _onSuccess: () => true,
      _onError: (error) => {
        logger.error(`공지사항(ID: ${id}) 삭제 실패:`, error);
        return defaultErrorHandler(error);
      }
    });
    return !error;
  }
};
