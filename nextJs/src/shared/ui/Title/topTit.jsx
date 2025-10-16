import styles from './title.module.scss';

export default function Top({ title }) {
  //시간 가져오기
  const today = new Date();
  const year = today.getFullYear();
  const month = ('0' + (today.getMonth() + 1)).slice(-2);
  const day = ('0' + today.getDate()).slice(-2);
  const date = year + '.' + month + '.' + day;

  const hour = ('0' + today.getHours()).slice(-2);
  const minutes = ('0' + today.getMinutes()).slice(-2);
  const seconds = ('0' + today.getSeconds()).slice(-2);

  // 최종 출력
  const now = `${date} ${hour}:${minutes}:${seconds}`;

  return (
    <div className={styles.topWrap}>
      {/* 기업문구 */}
      <p className={styles.title}>{title}</p>
      <p className={styles.date}>최종접속 : {now}</p>
    </div>
  );
}
