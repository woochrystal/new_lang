import Link from 'next/link';
import styles from './list.module.scss';

/**
 * 메인화면 일반 게시판 리스트 항목 컴포넌트
 * @param {Object} props
 * @param {Object} [props.rest] - Link 컴포넌트에 전달할 추가 props
 * @param {string} [props.href='#'] - 게시물 상세 페이지 등 이동할 링크 (기본값: '#')
 * @param {string} props.title - 게시물 제목
 * @param {string|Date} props.submit - 게시물 작성일
 * @param {string} props.member - 작성자, 작성자 직급
 */

export default function BoardList(props) {
  return (
    <li className={`${styles.listBasicLi} ${styles.bdList}`}>
      <Link href={props.href || '#'} {...props.rest}>
        <p className={styles.bdLiTit}>{props.title}</p>
        <p className={styles.bdLiInfo}>
          <span className={styles.bdLiDate}>작성일 : {props.submit}</span>
          <span>작성자 : {props.member}</span>
        </p>
      </Link>
    </li>
  );
}
