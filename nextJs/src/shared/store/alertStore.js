/*
 * path           : src/shared/store/alertStore.js
 * fileName       : alertStore
 * author         : changhyeon
 * date           : 25. 10. 23.
 * description    : 에러/경고/확인 알림 스토어
 * ===========================================================
 * DATE              AUTHOR        NOTE
 * -----------------------------------------------------------
 * 25. 10. 23.       changhyeon       최초 생성
 * 25. 10. 23.       changhyeon       api 클라이언트 사용법 개선, 전역 오류처리 통합, function expression으로 코드 통일
 * 25. 10. 24.       changhyeon       api 클라이언트 사용시 try-catch를 사용하지 않도록 수정
 * 25. 10. 24.       changhyeon       import 수정
 * 25. 11. 14.       changhyeon       DX 개선: 오버로딩, 타입별 메서드 추가
 */

import { create } from 'zustand';

import { redirectToLogin, simpleHash } from '@/shared/lib';

/**
 * @typedef {Object} AlertState
 * @property {boolean} isOpen - Alert 표시 여부
 * @property {string} title - Alert 제목
 * @property {string} message - Alert 메시지
 * @property {'error'|'warning'|'success'|'info'|'confirm'} variant - Alert 타입
 * @property {string} confirmText - 확인 버튼 텍스트
 * @property {string} [cancelText] - 취소 버튼 텍스트
 * @property {Function} [onConfirm] - 확인 콜백
 * @property {Function} [onCancel] - 취소 콜백
 * @property {Function} [onClose] - 닫기 콜백
 */

/**
 * @typedef {Object} AlertOptions
 * @property {'error'|'warning'|'success'|'info'|'confirm'} [variant='error'] - Alert 타입
 * @property {string} [confirmText] - 확인 버튼 텍스트
 * @property {string} [cancelText] - 취소 버튼 텍스트
 * @property {Function} [onConfirm] - 확인 콜백
 * @property {Function} [onClose] - 닫기 콜백
 */

/**
 * 전역 Alert 관리 Store
 *
 * 모든 API 요청 실패, 비즈니스 로직 에러, 사용자 확인이 필요한 작업 등을
 * 중앙에서 관리합니다. GlobalErrorAlert 컴포넌트가 이 스토어를 구독하여
 * 자동으로 Alert를 표시합니다.
 *
 * 사용법:
 * ```javascript
 * // 간단한 에러 Alert
 * const { showError } = useAlertStore();
 * showError('네트워크 오류가 발생했습니다.');
 *
 * // 상세 설정
 * showError({
 *   title: '오류',
 *   message: '서버에 연결할 수 없습니다.',
 *   variant: 'error'
 * });
 *
 * // 타입별 메서드
 * showSuccess('저장되었습니다.');
 * showWarning('주의가 필요합니다.');
 * showInfo('시스템 점검 예정입니다.');
 *
 * // 확인 다이얼로그
 * const { showConfirm } = useAlertStore();
 * showConfirm({
 *   title: '게시글 삭제',
 *   message: '정말로 삭제하시겠습니까?',
 *   onConfirm: () => api.delete(postId),
 *   variant: 'warning',
 *   confirmText: '삭제'
 * });
 *
 * // 인증 오류 (자동으로 로그인 페이지로 이동)
 * const { showAuthError } = useAlertStore();
 * showAuthError('세션이 만료되었습니다');
 * ```
 *
 * @returns {Object} Alert 관리 메서드
 * @returns {AlertState|null} error - 현재 Alert 상태 (표시할 alert가 없으면 null)
 * @returns {Function} showError - 에러 Alert 표시
 * @returns {Function} showSuccess - 성공 Alert 표시
 * @returns {Function} showWarning - 경고 Alert 표시
 * @returns {Function} showInfo - 정보 Alert 표시
 * @returns {Function} showConfirm - 확인 다이얼로그 표시
 * @returns {Function} showAuthError - 인증 오류 표시
 * @returns {Function} closeError - Alert 닫기
 */
export const useAlertStore = create((set, get) => {
  /**
   * Alert 상태를 설정하는 내부 헬퍼 함수
   */
  const setAlert = (config) => {
    const {
      title,
      message,
      variant = 'error',
      confirmText = '확인',
      cancelText,
      onConfirm,
      onCancel,
      onClose,
      autoClose = null,
      timestamp = Date.now()
    } = config;

    const key = simpleHash(`${title}|${message}|${variant}|${timestamp}`);

    set({
      error: {
        isOpen: true,
        title: title || '알림',
        message,
        variant,
        confirmText,
        cancelText,
        onConfirm,
        onCancel,
        onClose,
        autoClose,
        timestamp,
        key
      }
    });
  };

  /**
   * 메시지 또는 설정 객체를 정규화하는 헬퍼
   * - 필수 props만 설정하고 나머지는 사용자가 제공한 경우만 포함
   */
  const normalizeConfig = (messageOrConfig, defaultVariant = 'error', defaultTitle = '알림') => {
    if (typeof messageOrConfig === 'string') {
      return {
        title: defaultTitle,
        message: messageOrConfig,
        variant: defaultVariant
      };
    }
    // 사용자가 제공한 props만 포함 (기본값 없음)
    return {
      title: messageOrConfig.title || defaultTitle,
      message: messageOrConfig.message,
      variant: messageOrConfig.variant || defaultVariant,
      confirmText: messageOrConfig.confirmText,
      cancelText: messageOrConfig.cancelText,
      onConfirm: messageOrConfig.onConfirm,
      onCancel: messageOrConfig.onCancel,
      onClose: messageOrConfig.onClose,
      // 선택사항: autoClose는 제공된 경우만
      ...(messageOrConfig.autoClose !== undefined && { autoClose: messageOrConfig.autoClose })
    };
  };

  return {
    error: null,

    /**
     * 에러 Alert 표시
     *
     * @param {string|object} messageOrConfig - Alert 메시지 문자열 또는 상세 설정 객체
     * @param {string} [messageOrConfig.title='알림'] - Alert 제목 (객체일 때)
     * @param {string} messageOrConfig.message - Alert 메시지 (필수)
     * @param {'error'|'warning'|'success'|'info'} [messageOrConfig.variant='error'] - Alert 타입
     * @param {string} [messageOrConfig.confirmText='확인'] - 확인 버튼 텍스트
     * @param {Function} [messageOrConfig.onConfirm] - 확인 버튼 콜백
     * @param {Function} [messageOrConfig.onClose] - 닫기 콜백
     *
     * @example
     * // 문자열 사용: title은 자동으로 '알림'
     * showError('네트워크 오류가 발생했습니다.')
     *
     * @example
     * // 객체 사용: 상세 설정
     * showError({
     *   title: '네트워크 오류',
     *   message: '서버에 연결할 수 없습니다.',
     *   variant: 'error'
     * })
     */
    showError(messageOrConfig) {
      const config = normalizeConfig(messageOrConfig, 'error', '알림');
      setAlert(config);
    },

    /**
     * 성공 Alert 표시
     *
     * @param {string|object} messageOrConfig - Alert 메시지 문자열 또는 상세 설정 객체
     * @param {string} [messageOrConfig.title='성공'] - Alert 제목 (객체일 때)
     * @param {string} messageOrConfig.message - Alert 메시지 (필수)
     * @param {Function} [messageOrConfig.onConfirm] - 확인 버튼 콜백
     *
     * @example
     * // 문자열 사용: title은 자동으로 '성공'
     * showSuccess('저장되었습니다.')
     *
     * @example
     * // 객체 사용: 상세 설정
     * showSuccess({
     *   title: '저장 완료',
     *   message: '변경사항이 저장되었습니다.',
     *   onConfirm: () => navigate('/list')
     * })
     */
    showSuccess(messageOrConfig) {
      const config = normalizeConfig(messageOrConfig, 'success', '성공');
      setAlert(config);
    },

    /**
     * 경고 Alert 표시
     *
     * @param {string|object} messageOrConfig - Alert 메시지 문자열 또는 상세 설정 객체
     * @param {string} [messageOrConfig.title='경고'] - Alert 제목 (객체일 때)
     * @param {string} messageOrConfig.message - Alert 메시지 (필수)
     * @param {Function} [messageOrConfig.onConfirm] - 확인 버튼 콜백
     *
     * @example
     * // 문자열 사용: title은 자동으로 '경고'
     * showWarning('주의가 필요합니다.')
     *
     * @example
     * // 객체 사용: 상세 설정
     * showWarning({
     *   title: '삭제 경고',
     *   message: '이 작업은 취소할 수 없습니다.',
     *   variant: 'warning'
     * })
     */
    showWarning(messageOrConfig) {
      const config = normalizeConfig(messageOrConfig, 'warning', '경고');
      setAlert(config);
    },

    /**
     * 정보 Alert 표시
     *
     * @param {string|object} messageOrConfig - Alert 메시지 문자열 또는 상세 설정 객체
     * @param {string} [messageOrConfig.title='알림'] - Alert 제목 (객체일 때)
     * @param {string} messageOrConfig.message - Alert 메시지 (필수)
     * @param {Function} [messageOrConfig.onConfirm] - 확인 버튼 콜백
     *
     * @example
     * // 문자열 사용: title은 자동으로 '알림'
     * showInfo('시스템 점검이 예정되어 있습니다.')
     *
     * @example
     * // 객체 사용: 상세 설정
     * showInfo({
     *   title: '공지사항',
     *   message: '새로운 기능이 추가되었습니다.'
     * })
     */
    showInfo(messageOrConfig) {
      const config = normalizeConfig(messageOrConfig, 'info', '알림');
      setAlert(config);
    },

    /**
     * 확인 다이얼로그 표시
     *
     * @param {object} config - 설정 객체
     * @param {string} config.title - Alert 제목 (필수)
     * @param {string} config.message - Alert 메시지 (필수)
     * @param {Function} config.onConfirm - 확인 버튼 콜백 (필수)
     * @param {Function} [config.onCancel] - 취소 버튼 콜백
     * @param {Function} [config.onClose] - 닫기 콜백
     * @param {'confirm'|'warning'} [config.variant='confirm'] - Alert 타입
     * @param {string} [config.confirmText='확인'] - 확인 버튼 텍스트
     * @param {string} [config.cancelText='취소'] - 취소 버튼 텍스트
     *
     * @example
     * showConfirm({
     *   title: '게시글 삭제',
     *   message: '이 게시글을 삭제하시겠습니까?',
     *   onConfirm: () => api.delete(postId),
     *   variant: 'warning',
     *   confirmText: '삭제',
     *   cancelText: '취소'
     * })
     */
    showConfirm({
      title,
      message,
      onConfirm,
      onCancel,
      onClose,
      variant = 'confirm',
      confirmText = '확인',
      cancelText = '취소',
      autoClose
    }) {
      const timestamp = Date.now();
      const key = simpleHash(`${title}|${message}|${variant}|${timestamp}`);

      set({
        error: {
          isOpen: true,
          title,
          message,
          variant,
          confirmText,
          cancelText,
          onConfirm() {
            if (onConfirm) {
              onConfirm();
            }
            get().closeError();
          },
          onCancel() {
            if (onCancel) {
              onCancel();
            }
            get().closeError();
          },
          onClose,
          autoClose,
          timestamp,
          key
        }
      });
    },

    /**
     * 인증 오류 표시
     *
     * 세션 만료, 인증 실패 등 인증 관련 오류가 발생했을 때 사용합니다.
     * 사용자가 확인을 누르면 자동으로 로그인 페이지로 리다이렉트됩니다.
     *
     * @param {string|object} messageOrConfig - Alert 메시지 문자열 또는 상세 설정 객체
     * @param {string} messageOrConfig.message - Alert 메시지 (필수)
     * @param {string} [messageOrConfig.title='인증 오류'] - Alert 제목
     * @param {string} [messageOrConfig.confirmText='확인'] - 확인 버튼 텍스트
     *
     * @example
     * // 문자열 사용
     * showAuthError('로그인 세션이 만료되었습니다.')
     *
     * @example
     * // 객체 사용: 상세 설정
     * showAuthError({
     *   message: '로그인 세션이 만료되었습니다.',
     *   title: '세션 만료'
     * })
     */
    showAuthError(messageOrConfig) {
      const config = typeof messageOrConfig === 'string' ? { message: messageOrConfig } : messageOrConfig;

      const { message = config.message, title = '인증 오류', confirmText = '확인', autoClose } = config;

      const timestamp = Date.now();
      const key = simpleHash(`인증 오류|${message}|error|${timestamp}`);

      set({
        error: {
          isOpen: true,
          title,
          message,
          variant: 'error',
          confirmText,
          cancelText: undefined,
          onConfirm() {
            try {
              redirectToLogin();
            } catch (error) {
              console.error('[AlertStore] showAuthError 콜백 에러:', error);
              redirectToLogin();
            }
            get().closeError();
          },
          onCancel: undefined,
          autoClose,
          timestamp,
          key
        }
      });
    },

    /**
     * Alert 닫기
     *
     * 현재 표시 중인 alert를 닫습니다.
     * showConfirm의 경우 onConfirm/onCancel 실행 후 자동으로 호출되므로
     * 일반적으로 showError에서만 수동으로 호출할 필요가 있습니다.
     *
     * @example
     * const { closeError } = useAlertStore();
     * closeError();
     */
    closeError() {
      set({ error: null });
    }
  };
});
