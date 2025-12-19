/*
 * path           : src/shared/component/errorpage/ErrorBoundary.jsx
 * fileName       : ErrorBoundary
 * author         : changhyeon
 * date           : 25. 11. 19.
 * description    : React Error Boundary - 렌더링 중 발생한 에러 캐치
 * ===========================================================
 * DATE              AUTHOR        NOTE
 * -----------------------------------------------------------
 * 25. 11. 19.       changhyeon       최초 생성
 */

'use client';

import React from 'react';
import { LoggerFactory } from '@/shared/lib';
import { ErrorState } from './ErrorState';

const logger = LoggerFactory.getLogger('ErrorBoundary');

/**
 * React 렌더링 중 발생한 에러를 캐치하여 Fallback UI를 표시합니다.
 *
 * 사용법:
 * ```javascript
 * <ErrorBoundary>
 *   <YourComponent />
 * </ErrorBoundary>
 * ```
 *
 * 개발 환경에서는 에러 스택이 콘솔에 출력되며,
 * 사용자 환경에서는 ErrorState로 친화적인 메시지를 표시합니다.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // 에러 정보 로깅
    logger.error('[ErrorBoundary] Caught error: {}', error.toString());

    // 개발 환경에서 상세 정보 출력
    if (process.env.NODE_ENV === 'development') {
      console.error('[ErrorBoundary] Error:', error);
      console.error('[ErrorBoundary] Component Stack:', errorInfo.componentStack);
    }

    // 상태 업데이트
    this.setState({
      error,
      errorInfo
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorState
          type="error"
          title="오류가 발생했습니다"
          message="페이지를 표시하는 중에 오류가 발생했습니다. 다시 시도해 주세요."
          onRetry={this.handleReset}
          retryText="다시 시도"
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
