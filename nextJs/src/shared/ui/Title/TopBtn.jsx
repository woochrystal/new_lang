import styles from './pageTit.module.scss';

export default function TopBtn({ children }) {
  return <div className={styles.topBtn}>{children}</div>;
}
