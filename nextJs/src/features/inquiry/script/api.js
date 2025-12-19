/**
 * path           : features/inquiry/script/api.js
 * fileName       : api.js
 * author         : 박재민
 * date           : 25. 11. 5.
 * description    : 문의사항 관련 API 호출을 담당하는 스크립트
 * ===========================================================
 * DATE              AUTHOR        NOTE
 * -----------------------------------------------------------
 * 25. 11. 5.        박재민       최초 생성
 */
import { apiClient, defaultErrorHandler } from '@/shared/api/client';
import LoggerFactory from '@/shared/lib/logger';

const ENDPOINT = '/api/v1/inquiries';
const ADMIN_ENDPOINT = '/api/v1/admin/inquiries';
const logger = LoggerFactory.getLogger('InquiryAPI');

export const inquiryApi = {
  /**
   * (관리자) 전체 문의 목록 조회 (페이지네이션 포함)
   */
  getAdminInquiries: ({ params }) => {
    return apiClient.get(ADMIN_ENDPOINT, {
      params,
      _onSuccess: (res) => res.data,
      _onError: (error) => {
        logger.error('관리자 문의 목록 조회 실패:', error);
        return defaultErrorHandler(error);
      }
    });
  },

  /**
   * 내 문의 목록 조회
   */
  getMyInquiries: ({ params }) => {
    return apiClient.get(ENDPOINT, {
      params,
      _onSuccess: (res) => res.data,
      _onError: (error) => {
        logger.error('문의 목록 조회 실패:', error);
        return defaultErrorHandler(error);
      }
    });
  },

  /**
   * 내 문의 상세 조회
   */
  getMyInquiryById: (inquiryId) => {
    return apiClient.get(`${ENDPOINT}/${inquiryId}`, {
      _onSuccess: (res) => res.data,
      _onError: (error) => {
        logger.error(`문의 상세 조회 실패 (ID: ${inquiryId}):`, error);
        return defaultErrorHandler(error);
      }
    });
  },

  /**
   * 문의 등록
   */
  async createInquiry(inquiryData, fileState) {
    const formData = new FormData();
    const inquiryBlob = new Blob([JSON.stringify(inquiryData)], {
      type: 'application/json'
    });
    formData.append('inquiry', inquiryBlob);

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

    if (fileState && fileState.new && fileState.new.length > 0) {
      fileState.new.forEach((file) => {
        formData.append('files', file);
      });
    }

    const { data } = await apiClient.post(ENDPOINT, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      _onSuccess: (response) => response.data,
      _onError: (error) => {
        logger.error('문의 등록 실패:', error);
        return defaultErrorHandler(error);
      }
    });
    return data;
  },

  /**
   *
   * (관리자) 문의 답변 등록/수정
   */
  answerInquiry: (inquiryId, data) => {
    return apiClient.put(`${ADMIN_ENDPOINT}/${inquiryId}/answer`, data, {
      _onSuccess: (res) => res.data,
      _onError: (error) => {
        logger.error(`문의 답변 등록/수정 실패 (ID: ${inquiryId}):`, error);
        return defaultErrorHandler(error);
      }
    });
  },

  /**
   * 문의 삭제
   */
  deleteInquiry: (inquiryId) => {
    return apiClient.delete(`${ADMIN_ENDPOINT}/${inquiryId}`, {
      _onSuccess: (res) => res.data,
      _onError: (error) => {
        logger.error(`문의 삭제 실패 (ID: ${inquiryId}):`, error);
        return defaultErrorHandler(error);
      }
    });
  }
};
