'use client';

import React from 'react';

/**
 * 메뉴 아이템 컴포넌트 (재귀 구조)
 * isSubItem prop을 통해 메인 메뉴와 서브 메뉴의 렌더링을 분기합니다.
 */
const MenuItem = ({ menu, activeMenu, activeMain, handleMainClick, handleSubClick, styles, isSubItem = false }) => {
  // 서브 메뉴일 경우의 렌더링 로직
  if (isSubItem) {
    return (
      <li className={activeMenu?.menuId === menu.menuId ? styles.on : ''}>
        <a onClick={() => handleSubClick(menu.menuUrl)}>{menu.menuNm}</a>
      </li>
    );
  }

  // 메인 메뉴일 경우의 렌더링 로직
  const hasChildren = menu.children?.length > 0;
  const isAccordionOpen = activeMain === menu.menuId;
  const isDirectlyActive = activeMenu?.menuId === menu.menuId;

  const classNames = [];
  if (isAccordionOpen) {
    classNames.push(styles.active); // 아코디언 펼침 상태
  }
  if (isDirectlyActive) {
    classNames.push(styles.on); // 현재 활성 메뉴 링크
  }

  return (
    <li className={classNames.join(' ')}>
      <a onClick={() => (hasChildren ? handleMainClick(menu.menuId) : handleSubClick(menu.menuUrl))}>
        <i>
          {menu.menuIcon ? (
            <img src={menu.menuIcon} alt="아이콘" />
          ) : (
            <span style={{ width: '16px', height: '16px', display: 'inline-block' }}></span>
          )}
          <span>{menu.menuNm}</span>
        </i>
        {hasChildren && (
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
            <g opacity="0.8">
              <path d="M3 4.5L6 7.5L9 4.5" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          </svg>
        )}
      </a>

      {hasChildren && (
        <ol>
          {menu.children.map((subMenu) => (
            <MenuItem
              key={subMenu.menuId}
              menu={subMenu}
              activeMenu={activeMenu}
              handleSubClick={handleSubClick}
              styles={styles}
              isSubItem={true} // 자식 메뉴는 isSubItem을 true로 전달
            />
          ))}
        </ol>
      )}
    </li>
  );
};

export default MenuItem;
