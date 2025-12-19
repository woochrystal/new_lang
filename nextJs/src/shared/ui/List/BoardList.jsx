import Link from 'next/link';
import styles from './list.module.scss';

export default function BoardList(props) {
  return (
    <ul className={styles.listBasic}>
      <li className={`${styles.listBasicLi} ${styles.mainBdList}`}>
        <Link href="#">
          <i></i>
          <div className={styles.linkWrap}>
            <p className={styles.bdLiTit}>공지사항 제목입니다. 공지사항 제목입니다. 공지사항 제목입니다.</p>
            <p className={styles.bdLiInfo}>
              <span className={styles.bdLiDate}>작성일 : 2025.09.17 10:10</span>
              <span>작성자 : 박지현 사원</span>
            </p>
          </div>
        </Link>
      </li>

      {/* 공지?? 상단고정게시물?? 은 .starTitle > .bdLiTit 안에 i 태그 있기만 하면 됨 */}
      <li className={`${styles.listBasicLi} ${styles.mainBdList} ${styles.starTitle}`}>
        <Link href="#">
          <i></i>
          <div className={styles.linkWrap}>
            <p className={styles.bdLiTit}>쨋쫙쓉쭙쨋쫙쓉쭙쨋쫙쓉쭙쨋쫙쓉쭙쨋쫙쓉쭙쨋쫙쓉쭙쨋쫙쓉쭙쨋</p>
            <p className={styles.bdLiInfo}>
              <span className={styles.bdLiDate}>작성일 : 2025.09.17 10:10</span>
              <span>작성자 : 박지현 사원</span>
            </p>
          </div>
        </Link>
      </li>
    </ul>
  );
}
