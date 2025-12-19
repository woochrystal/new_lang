import { useState } from 'react';
import LogoutBtn from '@/shared/ui/Button/LogoutBtn';
import BrandInfo from '@/shared/ui/Title/BrandInfo';
import UserInfo from '@/shared/ui/Title/UserInfo';
import styles from './leftMenu.module.scss';

/*
아코디언 클릭(메인메뉴)
해당 ul > li 에 active className 생성 - <li className={styles.active}>

활성화(현재위치) 메뉴(하위메뉴)
해당 ol > li 에 on className 생성 - <ol><li className={styles.on}>
*/

export default function LeftMenu() {
  const [activeMain, setActiveMain] = useState(null); //아코디언
  const [onSub, setOnSub] = useState(null); //현재 메뉴

  const menu = [
    // [menuIcon:"/menuIcon/menuIcon1.svg", menuName:"전자 결재"]
  ];

  const title = '기업 맞춤형 IT 솔루션, 펜타웨어';
  const brandInfo01 = {
    logosrc: '/logo/logo.png',
    brandname: '펜타웨어'
  };
  const userInfo01 = {
    nickname: 'islayruth',
    username: '기은'
  };

  const handleMainClick = (menuKey) => {
    setActiveMain((prev) => (prev == menuKey ? null : menuKey));
  };

  const handleSubClick = (menuKey) => {
    setOnSub(menuKey);
  };

  return (
    <div className={styles.leftMenu}>
      <div>
        <div className={styles.leftTop}>
          <BrandInfo info={brandInfo01} />
          {/* 사용자정보 */}
          <UserInfo info={userInfo01} />
        </div>

        {/* 로그인버튼 */}
        <LogoutBtn />
      </div>

      <ul>
        <li className={activeMain == 'menu1' ? styles.active : ''}>
          <a onClick={() => handleMainClick('menu1')}>
            <i>
              <img src="/menuIcon/menuIcon1.svg" alt="아이콘" />
              <span>전자 결재</span>
            </i>
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
              <g opacity="0.8">
                <path d="M3 4.5L6 7.5L9 4.5" stroke_width="0.8" stroke_linecap="round" stroke_linejoin="round" />
              </g>
            </svg>
          </a>
        </li>

        <li className={activeMain == 'menu2' ? styles.active : ''}>
          <a onClick={() => handleMainClick('menu2')}>
            <i>
              <img src="/menuIcon/menuIcon4.svg" alt="아이콘" />
              <span>인사 관리</span>
            </i>
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
              <g opacity="0.8">
                <path d="M3 4.5L6 7.5L9 4.5" stroke_width="0.8" stroke_linecap="round" stroke_linejoin="round" />
              </g>
            </svg>
          </a>

          <ol>
            {/* 활성화 서브메뉴 */}
            <li className={onSub == 'sub1' ? styles.on : ''}>
              <a onClick={() => handleSubClick('sub1')}>직원 조회</a>
            </li>
            <li className={onSub == 'sub2' ? styles.on : ''}>
              <a onClick={() => handleSubClick('sub2')}>휴가 관리</a>
            </li>
          </ol>
        </li>
      </ul>
    </div>
  );
}
