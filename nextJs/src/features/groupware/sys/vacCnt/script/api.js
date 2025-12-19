/**
 * @fileoverview VacCnt API 서비스
 * @description 휴가일수관리 CRUD API 호출
 *
 * 데이터와 콜백을 하나의 객체로 통합
 * _onSuccess: 필수 (데이터 변환)
 * _onError: 선택 (에러 처리)
 */

import { apiClient, defaultErrorHandler } from '@/shared/api/client';
import { LoggerFactory } from '@/shared/lib/logger';

/**
 * API 베이스 엔드포인트
 * @type {string}
 */
const ENDPOINT = '/api/v1/sys/vacCnt';

const logger = LoggerFactory.getLogger('VacCntAPI');

/**
 * VacCnt API 서비스
 * 백엔드 API: /api/v1/sys/vacCnt
 * 인증: JWT 토큰 필요 (tenantId, userId 자동 추출)
 */
export const api = {
  /**
   * 특정 휴가일수를 수정합니다.
   * PUT /api/v1/sys/vacCnt/{vacCntId}
   * @param {number} vacCntId - 수정할 휴가일수 ID
   * @param {import('./schema').VacCntInput} vacCntData - 수정할 데이터
   * @returns {Promise<{data: import('./entity').ApiVacCnt|null, error: any}>} 수정된 휴가일수 데이터 또는 에러
   */
  async update(vacCntId, vacCntData) {
    logger.info('[api.update] 입력 데이터:', vacCntData);

    // 안전한 숫자 변환 함수 (NaN 방지)
    const toNumber = (value, defaultValue = 0) => {
      const num = Number(value);
      return isNaN(num) ? defaultValue : num;
    };

    // 백엔드 DTO(VacCntUpdateIDT)가 기대하는 필드:
    // - totVac (Integer): 총 휴가 일수
    // - useVac (BigDecimal): 사용한 휴가 일수
    // 참고: empName, baseYr은 수정 불가 (DTO에 없음)
    const backendData = {
      totVac: toNumber(vacCntData.totalVacationDays, 0),
      useVac: toNumber(vacCntData.usedVacationDays, 0)
    };

    logger.info('[api.update] 백엔드로 전송할 데이터:', backendData);
    logger.info('[api.update] 각 필드 타입:', {
      totVac: typeof backendData.totVac,
      useVac: typeof backendData.useVac
    });

    return await apiClient.put(`${ENDPOINT}/${vacCntId}`, backendData, {
      _onSuccess: (response) => response.data
    });
  },

  /**
   * 특정 휴가일수를 삭제합니다.
   * DELETE /api/v1/sys/vacCnt/{vacCntId}
   * @param {number} vacCntId - 삭제할 휴가일수 ID
   * @returns {Promise<boolean>} 삭제 성공 여부
   */
  async delete(vacCntId) {
    const { error } = await apiClient.delete(`${ENDPOINT}/${vacCntId}`, {
      _onSuccess: () => true,
      _onError: (error) => {
        logger.error(`[api.delete] 휴가일수(ID: ${vacCntId}) 삭제 실패:`, error);
        return defaultErrorHandler(error);
      }
    });
    return !error;
  },

  /**
   * 휴가일수 목록을 조회합니다. (페이징, 검색, 필터 지원)
   * GET /api/v1/sys/vacCnt/list?page=1&size=10&baseYr=2024&empName=홍길동
   * @param {import('./schema').VacCntListQuery} [params={}] - 조회 파라미터
   * @returns {Promise<import('./entity').ApiVacCntList|null>} 휴가일수 목록 데이터 (실패 시 null)
   */
  async getList(params = {}) {
    // 프론트엔드 파라미터를 백엔드 파라미터로 변환
    const backendParams = {
      page: params.page,
      size: params.size,
      baseYr: params.year, // year → baseYr 변환
      empName: params.empName
    };

    const { data } = await apiClient.get(`${ENDPOINT}/list`, {
      params: backendParams,
      _onSuccess: (response) => {
        logger.info('[api.getList] 백엔드 응답:', response.data);
        return response.data;
      }
    });
    return data;
  },

  /**
   * 특정 연도의 전체 직원 휴가일수를 일괄 생성합니다.
   * POST /api/v1/sys/vacCnt/batch-initialize
   * @param {string} year - 기준년도 (예: '2024')
   * @returns {Promise<{totalEmployees: number, successCount: number, skipCount: number, failCount: number, message: string}|null>} 일괄 생성 결과
   */
  async batchInitialize(year) {
    logger.info('[api.batchInitialize] 휴가일수 일괄 생성 요청: 기준년도=', year);

    const { data, error } = await apiClient.post(
      `${ENDPOINT}/batch-initialize`,
      { year },
      {
        _onSuccess: (response) => {
          logger.info('[api.batchInitialize] 일괄 생성 완료:', response.data);
          return response.data;
        },
        _onError: (error) => {
          logger.error('[api.batchInitialize] 일괄 생성 실패:', error);
          return defaultErrorHandler(error);
        }
      }
    );

    if (error) {
      return null;
    }

    return data;
  }
};
