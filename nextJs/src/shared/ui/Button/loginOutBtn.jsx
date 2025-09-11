import styles from '@/shared/ui/Button/buttonBasic.module.scss';
export default function LoginOutBtn() {
  return <button className={`${styles.btnBasic} ${styles.logout}`}>로그아웃</button>;
}
