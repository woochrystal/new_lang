import styles from './list.module.scss';

export default function List({ className = '', items, renderItem, children, ...rest }) {
  //데이터 배열만 받음
  const containerClasses = [styles.listBasic, className].filter(Boolean).join(' ');

  return (
    <ul className={containerClasses} {...rest}>
      {items &&
        renderItem &&
        items.map((item, idx) => (
          <li className={styles.listBasicLi} key={idx}>
            {renderItem(item, idx)}
          </li>
        ))}
      {children}
    </ul>
  );
}
