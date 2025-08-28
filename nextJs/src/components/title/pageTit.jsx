import styles from './pageTit.module.scss'

const pageTitle = "휴가 관리";
const pageInfo = "휴가를 상신하고 결재 상태를 조회할 수 있습니다.";

export default function PageTit(){
    return(
        <div className={styles.pageTit}>
            <div>
                <h2>{pageTitle}</h2>
                <p>{pageInfo}</p>
            </div>
        </div>
    )
}