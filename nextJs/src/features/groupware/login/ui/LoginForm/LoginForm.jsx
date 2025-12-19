'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/shared/auth';
import { useAuthStore, useTenantStore, useSavedLoginIdStore } from '@/shared/store';
import Button from '@/shared/ui/Button/Button';
import Input from '@/shared/component/input/Input';
import { validateLoginForm } from '../../index';
import { useCapsLockDetector } from '../../script/capsLockDetector';
import styles from './LoginForm.module.scss';
import checkStyles from '@/shared/component/input/input.module.scss';

/**
 * 로그인 폼 컴포넌트
 * @param {Object} props
 * @param {string} [props.title='로그인'] - 폼 제목
 * @param {string} [props.subtitle='펜타웨어에 오신것을 환영합니다.'] - 폼 부제목
 * @param {string} [props.className] - 추가 CSS 클래스
 * @param {string|null} [props.returnUrl=null] - 로그인 성공 후 리다이렉트할 URL (없으면 /dashboard로 이동)
 */
export const LoginForm = ({
  title = '로그인',
  subtitle = '펜타웨어에 오신것을 환영합니다.',
  className = '',
  returnUrl = null,
  ...props
}) => {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  const { capsLockOn } = useCapsLockDetector();
  const { clearReturnUrl } = useAuthStore();
  const { currentTenant } = useTenantStore();
  const { getSavedLoginId, setSavedLoginId, removeSavedLoginId } = useSavedLoginIdStore();
  const [rememberId, setRememberId] = useState(false);

  const [credentials, setCredentials] = useState({
    loginId: '',
    loginPwd: ''
  });

  const [fieldErrors, setFieldErrors] = useState({
    loginId: '',
    loginPwd: ''
  });

  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  // 저장된 아이디 로드
  useEffect(() => {
    if (!currentTenant?.id) return;

    const savedLoginId = getSavedLoginId(currentTenant.id);

    if (savedLoginId) {
      setCredentials((prev) => ({
        ...prev,
        loginId: savedLoginId
      }));
      setRememberId(true);
    }
  }, [currentTenant?.id, getSavedLoginId]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setCredentials((prev) => ({
      ...prev,
      [name]: value
    }));

    // Clear error message on input change after first submission attempt
    if (hasAttemptedSubmit && fieldErrors[name]) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: ''
      }));
    }
  };

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
    const { error } = await login(credentials);
    // 로그인 실패 시 return
    if (error) {
      return;
    }

    // 아이디 저장 (테넌트별)
    if (currentTenant?.id) {
      if (rememberId) {
        setSavedLoginId(currentTenant.id, credentials.loginId);
      } else {
        removeSavedLoginId(currentTenant.id);
      }
    }

    // 보안을 위해 상태에서 비밀번호 지우기
    setCredentials((prev) => ({ ...prev, loginPwd: '' }));

    // returnUrl 초기화
    clearReturnUrl();
    // returnUrl이 있으면 해당 경로로, 없으면 dashboard로 이동
    const redirectPath = returnUrl || '/dashboard';
    router.replace(redirectPath);
  };

  const sectionClasses = [styles.loginSection, className].filter(Boolean).join(' ');

  return (
    <section className={sectionClasses} {...props}>
      <div className={styles.loginCard}>
        <header className={styles.loginHeader}>
          <h1 className={styles.loginTitle}>{title}</h1>
          <p className={styles.loginSubtitle}>{subtitle}</p>
        </header>

        <form className={styles.loginForm} onSubmit={handleSubmit}>
          <div className={styles.loginInput}>
            <Input
              id="loginId"
              name="loginId"
              variant="text"
              label="아이디"
              value={credentials.loginId}
              onChange={handleChange}
              placeholder="아이디를 입력하세요"
              required
              disabled={isLoading}
              error={fieldErrors.loginId}
              className={styles.formInput}
            />

            <Input
              id="loginPwd"
              name="loginPwd"
              variant="password"
              label="비밀번호"
              value={credentials.loginPwd}
              onChange={handleChange}
              placeholder="비밀번호를 입력하세요"
              required
              disabled={isLoading}
              error={fieldErrors.loginPwd}
              className={styles.formInput}
            />

            {/* 캡스락 경고 - 고정 위치 */}
            <div className={styles.capsLockContainer}>
              {capsLockOn && <div className={styles.capsLockWarning}>Caps Lock이 켜져 있습니다</div>}
            </div>
          </div>

          <div className={styles.loginFormBtm}>
            <div className={styles.linkSection}>
              <div className={`${checkStyles.checkWrap} ${styles.checkWrap}`}>
                <label className={`${styles.rememberMe}`}>
                  <input type="checkbox" checked={rememberId} onChange={(e) => setRememberId(e.target.checked)} />
                  <i>
                    <img src={rememberId ? '/check_purple.svg' : '/check_fff.svg'} alt="체크 마크" />
                  </i>
                  <span>아이디 저장</span>
                </label>
              </div>

              <div className={styles.forgotPwWrap}>
                <a href="#" className={styles.forgotPassword}>
                  아이디 찾기
                </a>
                {' | '}
                <a href="#" className={styles.forgotPassword}>
                  비밀번호 찾기
                </a>
              </div>
            </div>

            <Button type="submit" variant="primary" className={styles.loginButton} disabled={isLoading}>
              {isLoading ? '로그인 중...' : '로그인'}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default LoginForm;
