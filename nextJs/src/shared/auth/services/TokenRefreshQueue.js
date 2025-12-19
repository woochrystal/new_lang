/*
 * path           : src/shared/auth/TokenRefreshQueue.js
 * fileName       : TokenRefreshQueue
 * author         : changhyeon
 * date           : 25. 11. 05.
 * description    : 토큰 갱신 중 concurrent 요청 큐 관리
 * ===========================================================
 * DATE              AUTHOR        NOTE
 * -----------------------------------------------------------
 * 25. 11. 05.       changhyeon       최초 생성
 * 25. 11. 11.       changhyeon       큐 대기 중 타임아웃 안전장치 추가 (10초)
 * 25. 11. 13.       changhyeon       메모리 누수 방지: 큐 크기 제한 추가
 */

import { LoggerFactory } from '@/shared/lib';

const logger = LoggerFactory.getLogger('TokenRefreshQueue');

// 큐 최대 크기 (메모리 누수 방지)
const MAX_QUEUE_SIZE = 50;

export class TokenRefreshQueue {
  constructor() {
    this.isRefreshingFlag = false;
    this.failedQueue = [];
  }

  /**
   * 토큰 갱신 상태 설정
   * @param {boolean} flag - 갱신 중 여부
   */
  setRefreshing(flag) {
    this.isRefreshingFlag = flag;
  }

  /**
   * 토큰 갱신 중인지 확인
   * @returns {boolean}
   */
  isRefreshing() {
    return this.isRefreshingFlag;
  }

  /**
   * 대기 중인 요청에 추가
   * @param {import('axios').AxiosRequestConfig} config - 원본 요청 설정
   * @returns {Promise} 원본 요청 결과
   */
  add(config) {
    return new Promise((resolve, reject) => {
      // 큐 크기 제한 초과 시 가장 오래된 요청 거부 (메모리 누수 방지)
      if (this.failedQueue.length >= MAX_QUEUE_SIZE) {
        logger.warn('[TokenRefreshQueue] Queue size exceeded ({}), rejecting oldest request', MAX_QUEUE_SIZE);
        const oldest = this.failedQueue.shift();
        if (oldest) {
          clearTimeout(oldest.timeout);
          oldest.reject(new Error('Queue size limit exceeded'));
        }
      }

      const timeout = setTimeout(() => {
        reject(new Error('Token refresh timeout'));
      }, 10000); // 10초

      this.failedQueue.push({
        resolve,
        reject,
        config,
        timeout
      });
    });
  }

  /**
   * 대기 중인 요청들 처리
   * @param {Function} callback - 각 요청에 대해 실행할 함수
   *        콜백의 파라미터: { resolve, reject, config }
   *
   * @example
   * queue.processQueue((failedRequest) => {
   *   failedRequest.resolve(client.request(failedRequest.config));
   * });
   */
  processQueue(callback) {
    this.failedQueue.forEach((failedRequest) => {
      clearTimeout(failedRequest.timeout);
      callback(failedRequest);
    });
    this.failedQueue = [];
  }

  /**
   * 대기 중인 요청들 거부
   * @param {Error} error - 거부 사유
   */
  rejectQueue(error) {
    this.failedQueue.forEach((failedRequest) => {
      clearTimeout(failedRequest.timeout);
      failedRequest.reject(error);
    });
    this.failedQueue = [];
  }

  /**
   * 대기 중인 요청 개수 조회
   * @returns {number}
   */
  getQueueSize() {
    return this.failedQueue.length;
  }
}
