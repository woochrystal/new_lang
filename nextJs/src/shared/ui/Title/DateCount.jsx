import styles from '@/shared/ui/Tag/tag.module.scss';
// 메인화면 상단 잔여 휴가일 표시

const DateCount = ({ useVac = 0, remainVac = 0 }) => {
  return (
    <div className={styles.dateTagWrap}>
      <p className={styles.dateCount}>
        휴가 사용일 : <span>{useVac}</span>일
      </p>
      <p className={styles.dateCount}>
        잔여 휴가일 : <span>{remainVac}</span>일
      </p>
    </div>
  );
};

export default DateCount;
