import styles from './pageTit.module.scss';

// 페이지 타이틀
export default function PageTit({ pageTitCon }) {
  const { pageTitle, pageInfo } = pageTitCon;
  return (
    <div className={styles.pageTit}>
      <h2>{pageTitle}</h2>
      <p>{pageInfo}</p>
    </div>
  );
}
