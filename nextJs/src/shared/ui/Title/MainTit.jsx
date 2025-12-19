// 메인에만 사용하는 타이틀 - 현재 날짜, 휴가사용일(children) 등 표시

import styles from './title.module.scss';

const MainTit = ({ children, ...rest }, ref) => {
  //날짜 가져오기
  const today = new Date();
  const year = today.getFullYear();
  const month = ('0' + (today.getMonth() + 1)).slice(-2);
  const day = ('0' + today.getDate()).slice(-2);

  //요일 가져오기
  const week = ['일', '월', '화', '수', '목', '금', '토'];
  const dayOfWeek = week[today.getDay()];
  const date = year + '년 ' + month + '월 ' + day + '일 ' + '(' + dayOfWeek + ')';

  return (
    <div ref={ref} {...rest} className={`${styles.mainTit}`}>
      <h2>{date}</h2>
      <div className={styles.dateTagWrap}>{children}</div>
    </div>
  );
};

export default MainTit;
