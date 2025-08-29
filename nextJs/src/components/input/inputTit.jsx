import styles from './inputTit.module.scss'

export default function InputTit({inputTit}){
    return(
        <div className={styles.inputTit}>
            <span>{inputTit}</span>
        </div>
    )
}