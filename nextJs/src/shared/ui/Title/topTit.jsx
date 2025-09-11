import styles from './topTit.module.scss';

export default function Top({ title }) {
  return (
    <div className={styles.topWrap}>
      {/* 기업문구 */}
      <p>{title}</p>
    </div>
  );
}
