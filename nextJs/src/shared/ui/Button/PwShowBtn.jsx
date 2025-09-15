import styles from '@/shared/ui/Button/buttonBasic.module.scss';
export default function PwShowBtn() {
  return (
    <button className={`${styles.pwShowBtn}`}>
      <img src="/pwShowBtn_off.svg" alt="눈 꺼져있는 아이콘" />
      <img src="/pwShowBtn_on.svg" alt="눈 켜져있는 아이콘" />
    </button>
  );
}
