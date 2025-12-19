/*
 * path           : src/shared/auth/useMenu.js
 * fileName       : useMenu
 * author         : changhyeon
 * date           : 25. 11. 05.
 * description    : 권한 기반 메뉴 로드 및 활성 메뉴 추적
 * ===========================================================
 * DATE              AUTHOR        NOTE
 * -----------------------------------------------------------
 * 25. 11. 05.       changhyeon       최초 생성
 * 25. 11. 11.       changhyeon       유효 토큰 확인 후 메뉴 로드 조건 추가, flatMenuMap export 추가
 */

'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useMemo } from 'react';

import { useMenuStore } from '@/shared/store';

import { useAuth } from './useAuth';

/**
 * 반환 값:
 * - menuTree: 백엔드가 이미 권한 기반으로 필터링한 메뉴
 * - activeMenu: 현재 URL과 매칭되는 메뉴 항목
 * - breadcrumb: 현재 메뉴까지의 경로 (상위 메뉴들)
 * - isActive(menuId): 특정 메뉴가 활성 상태인지 체크
 * - isActiveUrl(menuUrl): URL 매칭 체크
 * - reload(): 메뉴 재로드
 * - isLoading, error: 로딩/에러 상태
 */
export const useMenu = () => {
  const pathname = usePathname();
  const { hasValidTokens } = useAuth();
  const { menuTree, flatMenuMap, isLoading, error, loadMenuTree, getBreadcrumb } = useMenuStore();

  // 초기 로드: 유효한 토큰이 있고, 메뉴가 아직 로드되지 않았을 때만 실행
  useEffect(() => {
    if (hasValidTokens && !menuTree && !isLoading && !error) {
      loadMenuTree();
    }
  }, [hasValidTokens, menuTree, isLoading, error, loadMenuTree]);

  // 백엔드에서 이미 권한별로 필터링해서 주므로 여기서는 그냥 사용
  const filteredMenuTree = useMemo(() => {
    return menuTree;
  }, [menuTree]);

  // 현재 페이지 경로(pathname)와 맞는 메뉴 찾기
  const activeMenu = useMemo(() => {
    let nearMatched = null;
    let maxLen = -1;

    const menus = Object.values(flatMenuMap);
    for (const menu of menus) {
      if (!menu.menuUrl || !pathname) {
        continue;
      }

      // 1. 완전 일치하는 경우 즉시 반환
      if (pathname === menu.menuUrl) {
        return menu;
      }

      // 2. 하위 경로인 경우 (예: 상세 페이지)
      // 더 긴 URL이 더 구체적인 메뉴이므로 길이 비교
      if (pathname.startsWith(`${menu.menuUrl}/`)) {
        if (menu.menuUrl.length > maxLen) {
          maxLen = menu.menuUrl.length;
          nearMatched = menu;
        }
      }
    }

    return nearMatched;
  }, [flatMenuMap, pathname]);

  // 현재 메뉴의 상위 경로들 (루트부터 현재까지)
  const breadcrumb = useMemo(() => {
    return activeMenu ? getBreadcrumb(activeMenu.menuId) : [];
  }, [activeMenu, getBreadcrumb]);

  return {
    menuTree: filteredMenuTree,
    flatMenuMap,
    isLoading,
    error,
    reload: loadMenuTree,

    // 활성 메뉴 관련
    activeMenu,
    breadcrumb,

    // 특정 메뉴가 활성 상태인지 확인
    isActive: (menuId) => activeMenu?.menuId === menuId,

    // URL이 특정 경로와 매칭되는지 확인
    isActiveUrl: (menuUrl) => pathname === menuUrl || pathname.startsWith(`${menuUrl}/`)
  };
};

export default useMenu;
