import styles from './search.module.scss';
import SearchInput from './SearchInput';

export default function SearchBox({ searchInfo }) {
  return (
    <div className={styles.searchCustom}>
      <SearchInput searchInfo={searchInfo} />
    </div>
  );
}
