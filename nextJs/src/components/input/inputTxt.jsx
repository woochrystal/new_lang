import styles from './inputTxt.module.scss';
import InputTit from './inputTit';

// 텍스트 인풋
export default function InputTxt({txtTit}){
    return(
        <div className={styles.inputTxtCustom}>
            <InputTit inputTit={txtTit}/>

            <div>
                <input  type="text"
                        id="nickname"
                        className={styles.inputTxt}
                        placeholder="모델명 입력"
                />
            </div>
        </div>
    )
};