/**
 * @fileoverview LoginForm 컴포넌트
 * @description 로그인 폼을 담당하는 컴포넌트
 */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/shared/auth';
import { getTenantBasePath } from '@/shared/lib/routing';
import { Alert } from '@/shared/ui/Popup/Alert';
import Button from '@/shared/ui/Button/Button';
import { validateField, validateLoginForm, LoginInput } from '../../index';
import { useCapsLockDetector } from '../../script/capsLockDetector';
import styles from './LoginForm.module.scss';

/**
 * 로그인 폼 컴포넌트
 * @param {Object} props
 * @param {string} [props.title='로그인'] - 폼 제목
 * @param {string} [props.subtitle='펜타웨어에 오신것을 환영합니다.'] - 폼 부제목
 * @param {string} [props.className] - 추가 CSS 클래스
 */
export const LoginForm = ({
  title = '로그인',
  subtitle = '펜타웨어에 오신것을 환영합니다.',
  className = '',
  ...props
}) => {
  const router = useRouter();
  const { login, isLoading, error, clearError } = useAuth();
  const { capsLockOn } = useCapsLockDetector();

  const [credentials, setCredentials] = useState({
    loginId: '',
    loginPwd: ''
  });

  const [fieldErrors, setFieldErrors] = useState({
    loginId: '',
    loginPwd: ''
  });

  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 제출 시도 표시
    setHasAttemptedSubmit(true);

    // 폼 전체 검증
    const validation = validateLoginForm(credentials);

    if (!validation.success) {
      setFieldErrors(validation.errors);
      return;
    }

    // 검증 통과 시 로그인 진행
    try {
      await login(credentials);
      // 동적 라우팅: 테넌트별 메인 페이지로 이동
      const basePath = getTenantBasePath();
      router.push(basePath || '/groupware'); // 로그인 성공 시 메인 페이지로
    } catch (err) {
      console.error('로그인 처리 중 오류:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // 값 업데이트
    setCredentials((prev) => ({
      ...prev,
      [name]: value
    }));

    // 제출 시도 후에는 값이 변경되면 해당 필드 에러 상태 해제
    if (hasAttemptedSubmit && fieldErrors[name]) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const sectionClasses = [styles.loginSection, className].filter(Boolean).join(' ');

  return (
    <section className={sectionClasses} {...props}>
      <div className={styles.loginCard}>
        <header className={styles.loginHeader}>
          <h1 className={styles.loginTitle}>{title}</h1>
          <p className={styles.loginSubtitle}>{subtitle}</p>

          {/* 캡스락 경고 - 고정 위치 */}
          <div className={styles.capsLockContainer}>
            {capsLockOn && <div className={styles.capsLockWarning}>⚠ Caps Lock이 켜져 있습니다</div>}
          </div>
        </header>

        <form className={styles.loginForm} onSubmit={handleSubmit}>
          <LoginInput
            id="loginId"
            name="loginId"
            type="text"
            label="아이디"
            value={credentials.loginId}
            onChange={handleChange}
            placeholder="최소 5자리 ~ 최대 12자리, 영문 대소문자.."
            required
            disabled={isLoading}
            error={fieldErrors.loginId}
            formGroupClass={styles.formGroup}
            inputClass={styles.formInput}
            errorClass={styles.fieldError}
          />

          <LoginInput
            id="loginPwd"
            name="loginPwd"
            type="password"
            label="비밀번호"
            value={credentials.loginPwd}
            onChange={handleChange}
            placeholder="비밀번호를 입력하세요"
            required
            disabled={isLoading}
            error={fieldErrors.loginPwd}
            formGroupClass={styles.formGroup}
            inputClass={styles.formInput}
            errorClass={styles.fieldError}
          />

          <div className={styles.linkSection}>
            <label className={styles.rememberMe}>
              <input type="checkbox" />
              아이디 저장
            </label>
            <div>
              <a href="#" className={styles.forgotPassword}>
                아이디 찾기
              </a>
              {' | '}
              <a href="#" className={styles.forgotPassword}>
                비밀번호 찾기
              </a>
            </div>
          </div>

          {error && <Alert title="로그인 오류" message={error} type="error" confirmText="확인" onClose={clearError} />}

          <Button
            type="submit"
            variant="primary"
            className={styles.loginButton}
            disabled={isLoading}
            label={isLoading ? '로그인 중...' : '로그인'}
          />
        </form>
      </div>
    </section>
  );
};

export default LoginForm;
