/*
 * path           : src/shared/hooks/useApi.js
 * fileName       : useApi
 * author         : changhyeon
 * date           : 25. 11. 10.
 * description    : ABAC 기반 컨텍스트별 권한 관리 API 호출 훅 (has() 함수로 권한 체크)
 * ===========================================================
 * DATE              AUTHOR        NOTE
 * -----------------------------------------------------------
 * 25. 11. 10.       changhyeon       최초 생성 (ABAC 마이그레이션)
 * 25. 11. 11.       changhyeon       has() 함수 정책 확정 (AND 조건), 파일 헤더 추가
 */

'use client';

import { useEffect, useState, useCallback } from 'react';

import { LoggerFactory } from '@/shared/lib';

const logger = LoggerFactory.getLogger('useApi');

/**
 * ABAC 기반 컨텍스트별 권한 관리를 위한 API 호출 훅
 *
 * API 응답에서 metadata.permissions를 추출하고, 컨텍스트별 행동 권한을 체크하는
 * has() 함수를 제공하는 표준화된 데이터 페칭 훅입니다.
 *
 * @param {Function} apiCallFunction - API 호출 함수 (예: () => reportsApi.getList())
 * @param {Array} dependencies - useEffect 의존성 배열
 *
 * @returns {Object} - { data, has, isLoading, error }
 *   - data: metadata 필드가 제거된 순수 데이터
 *   - has(actions): 현재 컨텍스트의 권한 체크 함수
 *     * has('create') → boolean
 *     * has(['edit', 'delete']) → boolean (AND 조건: 모든 권한이 있어야 true)
 *   - isLoading: 로딩 상태
 *   - error: 에러 객체 또는 null
 *
 * 사용 예시:
 * ```jsx
 * const { data: reports, has, isLoading, error } = useApi(
 *   () => reportsApi.getList({ page: 1 }),
 *   [page]
 * );
 *
 * return (
 *   <>
 *     {has('create') && <Button>새 보고서</Button>}
 *     {reports?.map(r => (
 *       <div key={r.id}>
 *         {r.title}
 *         {has('edit') && <EditBtn />}
 *       </div>
 *     ))}
 *   </>
 * );
 * ```
 */
export const useApi = (apiCallFunction, dependencies = []) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [permissions, setPermissions] = useState([]);

  // 권한 체크 헬퍼 함수
  const has = useCallback(
    (actions) => {
      // 문자열이면 배열로 변환
      const actionArray = Array.isArray(actions) ? actions : [actions];

      // 빈 배열이면 체크할 필요 없으므로 true
      if (actionArray.length === 0) {
        return true;
      }

      // AND 조건: 모든 권한이 있어야 true
      return actionArray.every((action) => permissions.includes(action));
    },
    [permissions]
  );

  useEffect(() => {
    if (!apiCallFunction) {
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await apiCallFunction();

        if (result?.error) {
          setError(result.error);
          setData(null);
          setPermissions([]);
          logger.error('API 호출 실패:', result.error);
          return;
        }

        // metadata.permissions 추출
        const extractedPermissions = result?.metadata?.permissions || [];
        setPermissions(extractedPermissions);

        // metadata 필드 제거 (순수 데이터만 반환)
        const { metadata, ...pureData } = result || {};
        setData(pureData);
      } catch (err) {
        const errorObj = err instanceof Error ? err : new Error(String(err));
        setError(errorObj);
        setData(null);
        setPermissions([]);
        logger.error('API 호출 중 예외 발생:', errorObj.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return {
    data,
    has,
    isLoading,
    error
  };
};

export default useApi;
