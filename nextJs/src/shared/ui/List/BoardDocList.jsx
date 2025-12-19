import Link from 'next/link';
import Tag from '../Tag/Tag';
import styles from './list.module.scss';

export default function BoardDocList(props) {
  return (
    <ul className={styles.listBasic}>
      <li className={`${styles.listBasicLi} ${styles.boardDoc}`}>
        <Link href={'#'}>
          <Tag variant="square" status="approve">
            승인
          </Tag>

          <div className={styles.bdDocWrap}>
            <div className={styles.bdDocInfo}>
              <div className={styles.docInfoLeft}>
                <span className={styles.bdDocTit}>쨋쫙쓉쭙쨋쫙쓉쭙쨋쫙쓉쭙쨋</span>
                <span className={styles.bdDocNum}>문서번호 : MU-202409-031</span>
              </div>
              <div className={styles.docInfoRight}>
                <span className={styles.bdDocName}>기안자 : 박지현 사원</span>
                <span className={styles.bdDocDate}>상신일 : 2025.09.08 10:10</span>
              </div>
            </div>
            <p>업무 효율 향상을 제고하기 위한 교육 신청서</p>
          </div>
        </Link>
      </li>
    </ul>
  );
}
