import styles from './inputTxt.module.scss';

export default function Textarea() {
  return <textarea className={styles.textarea} placeholder="내용을 입력하세요."></textarea>;
}
