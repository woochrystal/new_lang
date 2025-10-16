import styles from '@/shared/ui/Tag/tag.module.scss';

const NumTag = () => {
  return (
    <div className={styles.numTag}>
      <div className={styles.numWrap}>
        <span></span>
      </div>
      <span></span>
    </div>
  );
};

export default NumTag;
