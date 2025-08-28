import styles from './inputTit.module.scss'

export default function InputTit(){
    const inputTit = '조회 구분';

    return(
        <div className={styles.inputTit}>
            <span>{inputTit}</span>
        </div>
    )
}