import styles from './pageTit.module.scss';

export default function TitBtnWrap({ children }) {
  return <div className={`${styles.TitBtnWrap}`}>{children}</div>;
}
