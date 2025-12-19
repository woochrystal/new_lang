'use client';

import { TenantGuard } from '@/shared/component';

/**
 * Groupware 라우트 레이아웃
 *
 * TenantGuard를 적용하여 멀티테넌시 검증 수행
 *
 * [현재 상태 - rename 전]
 * - /groupware/login → 이 파일 (groupware/layout.jsx) → TenantGuard
 * - /groupware/(member)/** → 이 파일 → TenantGuard
 * - 단일 테넌트 모드: params.tenant = undefined이므로 TenantGuard에서 children 통과
 * - 멀티 테넌트 모드: 아직 [tenant] 세그먼트 없으므로 접근 불가
 *
 * [rename 후 - git mv src/app/groupware src/app/[tenant]]
 * - /[tenant]/login → /[tenant]/layout.jsx (이 파일) → TenantGuard
 * - /[tenant]/(member)/** → /[tenant]/layout.jsx (이 파일) → TenantGuard
 * - 멀티테넌트 모드: params.tenant='tenant1'이므로 TenantGuard에서 테넌트 검증
 * - 단일 테넌트 모드: params.tenant = undefined이므로 children 통과
 *
 * 참고: 하위 경로(member)의 레이아웃들은 RouteGuard로 인증 검증만 수행
 */
export default function GroupwareLayout({ children }) {
  return <TenantGuard>{children}</TenantGuard>;
}
