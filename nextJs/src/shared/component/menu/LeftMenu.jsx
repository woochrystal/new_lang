'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/shared/component';
import { useAuth, useMenu, useTenant } from '@/shared/auth';
import styles from './leftMenu.module.scss';
import MenuItem from './MenuItem';

/**
 * 동적 메뉴 컴포넌트 (LeftMenu 기반)
 *
 * 기능:
 * - MenuODT 기반 동적 렌더링
 * - 사용자 권한 기반 자동 필터링
 * - 아코디언 스타일 메뉴
 * - 활성 메뉴 자동 추적
 * - 현재 활성 메뉴의 부모 자동 펼침
 *
 * @returns {React.ReactElement}
 */
export default function LeftMenu() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { tenant } = useTenant();
  const { menuTree, isLoading, error, activeMenu } = useMenu();

  const [activeMain, setActiveMain] = useState(null);

  // 활성 메뉴 상태에 따라 자동으로 부모 메뉴를 펼치거나 현재 메뉴를 활성화
  useEffect(() => {
    if (activeMenu) {
      if (activeMenu.uppMenuId) {
        // 하위 메뉴가 활성 상태이면 부모 메뉴를 펼침
        setActiveMain(activeMenu.uppMenuId);
      } else if (activeMenu.children?.length > 0) {
        // 자식이 있는 최상위 메뉴가 활성 상태이면 자신을 펼침
        setActiveMain(activeMenu.menuId);
      } else {
        // 자식이 없는 최상위 메뉴가 활성 상태이면 열려있는 메뉴가 없도록 null 처리
        setActiveMain(null);
      }
    }
  }, [activeMenu]);

  /**
   * 메인 메뉴 클릭 핸들러 (아코디언)
   * @param {number} menuId
   */
  const handleMainClick = (menuId) => {
    setActiveMain((prev) => (prev === menuId ? null : menuId));
  };

  /**
   * 서브 메뉴 클릭 핸들러 (네비게이션)
   * @param {string} menuUrl
   */
  const handleSubClick = (menuUrl) => {
    router.push(menuUrl);
  };

  // 로딩 상태
  if (isLoading) {
    return (
      <div className={styles.leftMenu}>
        <div>메뉴 로딩 중...</div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className={styles.leftMenu}>
        <div>메뉴 로드 실패: {error}</div>
      </div>
    );
  }

  // 최상위 메뉴만 렌더링 (depth 1)
  const topLevelMenus = menuTree?.filter((menu) => !menu.uppMenuId || menu.menuDepth === '1') || [];

  return (
    <div className={styles.leftMenu}>
      {/* 상단: 브랜드 정보 + 사용자 정보 */}
      <div className={styles.leftMenuHeader}>
        <div className={styles.leftTop}>
          {/* 브랜드 정보 */}
          <div className={styles.brandInfo}>
            {tenant?.logo && (
              <Image
                src={tenant.logo}
                alt={`${tenant?.name} 로고`}
                fill
                style={{ objectFit: 'contain' }}
                sizes="(max-width: 768px) 100vw, 200px"
              />
            )}
            <h1>{tenant?.name}</h1>
          </div>

          {/* 사용자 정보 */}
          <div className={styles.userBox}>
            <div className={styles.porfile}>
              <Image src="/circle_user.svg" alt="사용자 프로필 이미지" width={64} height={64} />
              {/* <Image src="/basic_profile.svg" alt="사용자 프로필 이미지" width={64} height={64} /> */}
            </div>
            <div className={styles.userName}>
              <span>{user?.loginId}</span>
              <span>({user?.usrNm})</span>
            </div>
          </div>
        </div>
        <Button variant="logout" onClick={logout}>
          로그아웃
        </Button>
      </div>

      {/* 메뉴 */}
      <ul>
        {topLevelMenus.map((mainMenu) => (
          <MenuItem
            key={mainMenu.menuId}
            menu={mainMenu}
            activeMenu={activeMenu}
            activeMain={activeMain}
            handleMainClick={handleMainClick}
            handleSubClick={handleSubClick}
            styles={styles}
          />
        ))}
      </ul>
    </div>
  );
}
