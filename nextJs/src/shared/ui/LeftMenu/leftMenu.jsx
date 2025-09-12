import LoginOutBtn from '@/shared/ui/Button/LoginOutBtn';
import UserInfo from '@/shared/ui/Title/UserInfo';
import styles from './leftMenu.module.scss';
export default function LeftMenu() {
  const menu = [
    // [menuIcon:"/menuIcon/menuIcon1.svg", menuName:"전자 결재"]
  ];
  const title = '기업 맞춤형 IT 솔루션, 펜타웨어';
  const userInfo01 = {
    nickname: 'islayruth',
    username: '기은'
  };
  return (
    <div className={styles.leftMenu}>
      <div>
        <div className={styles.leftTop}>
          <div className={styles.leftLogobox}>
            <img src="/logo/logo.png" alt="로고" />
            <h1>펜타웨어</h1>
          </div>
          {/* 사용자정보 */}
          <UserInfo userInfo={userInfo01} />
        </div>

        {/* 로그인버튼 */}
        <LoginOutBtn />
      </div>

      <ul>
        <li>
          <a>
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

        <li className={styles.active}>
          <a>
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
            <li className={styles.on}>
              <a>직원 조회</a>
            </li>
            <li>
              <a>휴가 관리</a>
            </li>
          </ol>
        </li>
      </ul>
    </div>
  );
}
