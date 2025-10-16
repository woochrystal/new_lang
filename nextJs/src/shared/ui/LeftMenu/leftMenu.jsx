'use client';
import React, { useState } from 'react';
import { Button } from '@/shared/ui/Button/Button';
import { BrandInfo } from '@/shared/ui/Title/BrandInfo';
import styles from './leftMenu.module.scss';
import UserInfo from '@/shared/ui/Title/UserInfo';

/**
 * 좌측 사이드바 메뉴 컴포넌트
 * @param {Object} props
 * @param {Object} props.brandInfo - 브랜드 정보
 * @param {string} props.brandInfo.logosrc - 로고 이미지 URL
 * @param {string} props.brandInfo.brandname - 브랜드명
 * @param {Object} props.user - 사용자 정보
 * @param {string} props.user.nickname - 사용자 닉네임
 * @param {string} props.user.username - 사용자명
 * @param {string} [props.user.userimagesrc] - 사용자 프로필 이미지 URL
 * @param {Array} [props.menuItems=[]] - 메뉴 항목 배열
 * @param {string} [props.activeMenuId] - 활성화된 메뉴 ID
 * @param {Function} [props.onMenuClick] - 메뉴 클릭 핸들러 (menuItem, subMenuItem?) => void
 * @param {Function} [props.onLogout] - 로그아웃 핸들러
 * @param {string} [props.className] - 추가 CSS 클래스
 * @param {React.Ref<HTMLDivElement>} [props.ref] - 컨테이너 div에 전달할 ref
 */
export const LeftMenu = ({
  brandInfo = {
    // 이부분 추후 zustand에서 불러오기
    logosrc: '/logo/logo.png',
    brandname: '펜타웨어'
  },
  user = {
    // zustand
    nickname: 'islayruth',
    username: '기은'
  },
  menuItems = [
    {
      // 백엔드에서 동적 외부 주입 or zustand
      id: 'Approval',
      label: '전자결재',
      iconSrc: '/menuIcon/menuIcon1.svg'
    },
    {
      id: 'HumanResourceManagement',
      label: '인사관리',
      iconSrc: '/menuIcon/menuIcon4.svg',
      subItems: [
        { id: 'EmployeeInquiry', isActive: false, label: '직원 조회' },
        { id: 'VacationManagement', isActive: false, label: '휴가 관리' }
      ]
    }
  ],

  activeMenuId,
  onMenuClick,
  onLogout,
  className = '',
  ref,
  ...rest
}) => {
  const [expandedMenus, setExpandedMenus] = useState(new Set([activeMenuId]));

  // 메뉴 펼침/닫힘 처리
  const handleMenuExpand = (menuId) => {
    setExpandedMenus((prev) => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(menuId)) {
        newExpanded.delete(menuId);
      } else {
        newExpanded.add(menuId);
      }
      return newExpanded;
    });
  };

  // 메뉴 항목 클릭 처리
  const handleMenuClick = (menuItem, subMenuItem = null) => {
    if (onMenuClick) {
      onMenuClick(menuItem, subMenuItem);
    }

    // 서브메뉴가 있는 메뉴라면 확장 토글
    if (menuItem.subItems && menuItem.subItems.length > 0 && !subMenuItem) {
      handleMenuExpand(menuItem.id);
    }
  };

  // 로그아웃 처리
  const handleLogout = () => {
    if (onLogout) {
      onLogout(); // 로그아웃 처리는 외부에서 주입
    }
  };

  const containerClasses = [styles.leftMenu, className].filter(Boolean).join(' ');

  return (
    <div ref={ref} className={containerClasses} {...rest}>
      <div>
        <div className={styles.leftTop}>
          <BrandInfo logosrc={brandInfo.logosrc} brandname={brandInfo.brandname} />

          <UserInfo nickname={user.nickname} username={user.username} userimagesrc={user.userimagesrc} />
        </div>

        {/* 로그아웃 버튼 */}
        <Button variant="logout" onClick={handleLogout}>
          로그아웃
        </Button>
      </div>

      {/* 동적 메뉴 리스트 */}
      {menuItems.length > 0 && (
        <ul>
          {menuItems.map((menuItem) => {
            const hasSubItems = menuItem.subItems && menuItem.subItems.length > 0;
            const isExpanded = expandedMenus.has(menuItem.id);
            const isActive = activeMenuId === menuItem.id;

            return (
              <li key={menuItem.id} className={isActive ? styles.active : ''}>
                <a
                  onClick={() => handleMenuClick(menuItem)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleMenuClick(menuItem);
                    }
                  }}
                >
                  <i>
                    {menuItem.iconSrc && <img src={menuItem.iconSrc} alt={`${menuItem.label} 아이콘`} />}
                    <span>{menuItem.label}</span>
                  </i>

                  {hasSubItems && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      style={{
                        transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s ease'
                      }}
                    >
                      <g opacity="0.8">
                        <path d="M3 4.5L6 7.5L9 4.5" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" />
                      </g>
                    </svg>
                  )}
                </a>

                {/* 서브메뉴 */}
                {hasSubItems && isExpanded && (
                  <ol>
                    {menuItem.subItems.map((subItem) => (
                      <li key={subItem.id} className={subItem.isActive ? styles.on : ''}>
                        <a
                          onClick={() => handleMenuClick(menuItem, subItem)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              handleMenuClick(menuItem, subItem);
                            }
                          }}
                        >
                          {subItem.label}
                        </a>
                      </li>
                    ))}
                  </ol>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default LeftMenu;
