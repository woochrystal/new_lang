import Link from 'next/link';
import styles from './list.module.scss';

export default function QuickMenu() {
  return (
    <ul className={`${styles.listBasic} ${styles.quickMenuList}`}>
      <li>
        <Link href={'#'}>
          <div className={styles.quickImg}>
            <img src={'/menuIcon/quick/qMenu01.png'} alt={'결재작성'} />
          </div>
          <span>결재작성</span>
        </Link>
      </li>
      <li>
        <Link href={'#'}>
          <div className={styles.quickImg}>
            <img src={'/menuIcon/quick/qMenu02.png'} alt={'휴가현황'} />
          </div>
          <span>휴가현황</span>
        </Link>
      </li>
      <li>
        <Link href={'#'}>
          <div className={styles.quickImg}>
            <img src={'/menuIcon/quick/qMenu03.png'} alt={'비용현황'} />
          </div>
          <span>비용현황</span>
        </Link>
      </li>
      <li>
        <Link href={'#'}>
          <div className={styles.quickImg}>
            <img src={'/menuIcon/quick/qMenu04.png'} alt={'보유장비현황'} />
          </div>
          <span>보유장비현황</span>
        </Link>
      </li>
      <li>
        <Link href={'#'}>
          <div className={styles.quickImg}>
            <img src={'/menuIcon/quick/qMenu05.png'} alt={'사내게시판'} />
          </div>
          <span>사내게시판</span>
        </Link>
      </li>
      {/* <li>
        <Link href={'#'}>
          <div className={styles.quickImg}>
            <img src={'/menuIcon/quick/qMenu06.png'} alt={'공지사항'} />
          </div>
          <span>공지사항</span>
        </Link>
      </li> */}
    </ul>
  );
}
