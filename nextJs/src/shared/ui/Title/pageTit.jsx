import styles from './pageTit.module.scss';

// 페이지 타이틀
export default function PageTit({ pageTitCon }) {
  const { pageTitle, pageInfo } = pageTitCon;
  return (
    <div className={styles.pageTit}>
      {/* 각 화면 페이지 명 */}
      <h2>{pageTitle}</h2>
      {/* 페이지 기능 설명 */}
      <p>{pageInfo}</p>
    </div>
  );
}
