import styles from '@/shared/ui/Button/buttonBasic.module.scss';
export default function BasicBtn() {
  // 흰색버튼
  const btnName = '버튼명';
  return <button className={`${styles.btnBasic}`}>{btnName}</button>;
}
