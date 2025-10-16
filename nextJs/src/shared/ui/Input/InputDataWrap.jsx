import styles from './inputTxt.module.scss';

const InputDataWrap = ({ data = {}, ...rest }, ref) => {
  return (
    <div ref={ref} className={styles.inputData} {...rest}>
      <p>{data.txt ?? '등록된 내용이 없습니다.'}</p>
    </div>
  );
};

export default InputDataWrap;
