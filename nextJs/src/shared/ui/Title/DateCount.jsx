import styles from '@/shared/ui/Tag/tag.module.scss';
// 메인화면 상단 잔여 휴가일 표시

const DateCount = () => {
  return (
    <>
      <p className={styles.dateCount}>
        휴가 사용일 : <span>11.0</span>일
      </p>
      <p className={styles.dateCount}>
        휴가 사용일 : <span>11.0</span>일
      </p>
    </>
  );
};

export default DateCount;
