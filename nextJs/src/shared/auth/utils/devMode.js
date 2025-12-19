/*
 * path           : src/shared/auth/devMode.js
 * fileName       : devMode
 * author         : changhyeon
 * date           : 25. 09. 12.
 * description    : 개발 모드 환경 설정 (BYPASS_AUTH)
 * ===========================================================
 * DATE              AUTHOR        NOTE
 * -----------------------------------------------------------
 * 25. 09. 12.       changhyeon       최초 생성
 * 25. 09. 12.       changhyeon       에러 메시지 처리 및 로그인, 권한관리 기능 추가
 * 25. 10. 14.       changhyeon       프론트엔드 백엔드 연동 샘플
 * 25. 10. 24.       jmpark           board fe 개발 be 주석 설명추가 코드 리펙토링
 * 25. 10. 24.       changhyeon       User객체에 대해 백엔드 응답 객체를 사용하도록 수정
 * 25. 11. 03.       changhyeon       권한 및 사용자정보 오버라이딩 이슈 해결
 * 25. 11. 10.       changhyeon       RBAC to ABAC 리팩토링 (permissionService 파일명 변경)
 * 25. 11. 11.       changhyeon       RBAC 관련 코드 완전 제거 (와일드카드 권한, 피처 플래그 등)
 * 25. 11. 13.       changhyeon       initializeBypassAuth 함수 제거 (로그인 시 토큰 생성으로 변경)
 */

/**
 * BYPASS_AUTH 모드 판정 (개발 모드)
 * NEXT_PUBLIC_BYPASS_AUTH=true이고 production이 아닐 때만 true
 */
export const shouldBypassAuth = () => {
  if (process.env.NODE_ENV === 'production') {
    return false;
  }
  return process.env.NEXT_PUBLIC_BYPASS_AUTH === 'true';
};

/**
 * 개발자 경고 표시 여부
 */
export const shouldShowDevAlert = () => {
  if (process.env.NODE_ENV === 'production') {
    return false;
  }
  return process.env.NEXT_PUBLIC_SHOW_DEV_ALERT === 'true';
};

/**
 * 개발 모드 사용자 생성
 * BYPASS_AUTH=true일 때 사용할 더미 사용자
 */
export const createDevUser = (tenantId = 1) => ({
  usrId: parseInt(process.env.NEXT_PUBLIC_DEV_USER_ID || '999', 10),
  usrNm: process.env.NEXT_PUBLIC_DEV_USER_NAME || '개발자',
  loginId: 'dev',
  usrRole: process.env.NEXT_PUBLIC_DEV_USER_ROLE || 'ADMIN',
  tenantId: tenantId || 1,
  deptId: 1,
  deptNm: '개발팀',
  features: []
});
