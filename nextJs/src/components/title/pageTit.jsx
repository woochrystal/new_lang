import styles from './pageTit.module.scss'

// 페이지 타이틀
export default function PageTit({pageTitle, pageInfo}){
    return(
        <div className={styles.pageTit}>
            <div>
                <h2>{pageTitle}</h2>
                <p>{pageInfo}</p>
            </div>
        </div>
    )
}