"use client";
import { useEffect, useState } from "react";
import InputTit from "./inputTit"
import styles from "./select.module.scss"

export default function Select(){

    const defaultTxt = "선택해주세요.";
    const list = ['전체','연차','반차','병가','경조사','리프레시', '기타'];

    const [clickLi, setClickLi] = useState(defaultTxt);
    
    useEffect(()=>{
        const selectClick = (e)=>{
            const listWrap = e.target.closest('.option_wrap');
            const optionClick = e.target.closest('.option_list li');
    
            const liValue = e.target.attributes;
            const liTxt = e.target.innerText;
    
            if(listWrap){
                const hasActive = listWrap.classList.contains('active');
                listWrap.classList.add('active');
                if(hasActive){
                    listWrap.classList.remove('active');
                }
            }
            if(optionClick){
                listWrap.classList.add('has_value');
                // console.log(liValue)
                setClickLi(liTxt)
                return
            }

        };

        document.addEventListener('click', selectClick);
        
        return()=>{//clear
            document.addEventListener('click', selectClick);
        }
        
    },[]);
    
    return(
        <div className={styles.selectCustom}>

            <InputTit/>
            <div className={`${styles.selectOption} option_wrap`}>
                <div>
                    <p>{clickLi}</p>
                    
                    <i>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <g opacity="0.8">
                                <path d="M5 7.5L10 12.5L15 7.5" stroke="#333333" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                            </g>
                        </svg>
                    </i>
                </div>
                <ul className="option_list">
                    {
                        list.map((option, index)=>{
                            return<li key={index} data-value={index}>{option}</li>
                        })
                    }
                </ul>
            </div>
        </div>
    )
}