import Link from 'next/link';
import Tag from '../Tag/Tag';
import styles from './list.module.scss';

/**
 * 메인화면 결재문서 리스트 항목 컴포넌트
 * @param {Object} props
 * @param {string} [props.href='#'] - 문서 상세 페이지 등 이동할 링크 (기본값: '#')
 * @param {string} props.categori - 문서 카테고리명
 * @param {string|number} props.docNo - 문서번호
 * @param {string} props.member - 작성자, 작성자 직급 // 작성자-직급 따로 나눠야되남
 * @param {string|Date} props.submit - 문서 상신일 (제출일자)
 * @param {string} props.content - 결재문서 내용
 * @param {Object} [props.rest] - Link 컴포넌트에 전달할 추가 props
 */

export default function BoardDocList(props) {
  return (
    <li className={`${styles.listBasicLi} ${styles.boardDoc}`}>
      <Link href={props.href || '#'} {...props.rest}>
        <Tag variant="square" />
        <div className={styles.bdDocWrap}>
          <div className={styles.bdDocInfo}>
            <div className={styles.docInfoLeft}>
              <span className={styles.bdDocTit}>{props.categori}</span>
              <span className={styles.bdDocNum}>문서번호 : {props.docNo}</span>
            </div>
            <div className={styles.docInfoRight}>
              <span className={styles.bdDocName}>기안자 : {props.member}</span>
              <span className={styles.bdDocDate}>상신일 : {props.submit}</span>
            </div>
          </div>
          <p>{props.content}</p>
        </div>
      </Link>
    </li>
  );
}
