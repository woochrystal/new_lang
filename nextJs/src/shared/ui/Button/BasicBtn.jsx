import styles from '@/shared/ui/Button/buttonBasic.module.scss';
export default function BasicBtn({ btnName }) {
  // 흰색버튼
  return <button className={`${styles.btnBasic}`}>{btnName}</button>;
}
