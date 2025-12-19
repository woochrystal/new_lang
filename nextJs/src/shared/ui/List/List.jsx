import styles from './list.module.scss';

export default function List({ children }) {
  return <ul className={styles.listBasic}>{children}</ul>;
}
