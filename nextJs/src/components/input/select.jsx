"use client";
import { useEffect, useState } from "react";
import InputTit from "./inputTit"
import styles from "./select.module.scss"

export default function Select({selectTit, list, defaultTxt}){
    const [clickLi, setClickLi] = useState(defaultTxt);
    const [isOpen, setIsOpen] = useState(false);//열고닫기
    
    const activeToggle=()=>{
        setIsOpen((a)=>!a) //클릭할때마다 값 변경
    }
    const liClick =(b, e)=>{
        e.stopPropagation();
        setClickLi(b);
        setIsOpen(false);//선택하고 바로 닫음
    }

    // useEffect(()=>{
    //     const selectClick = (e)=>{
    //         const listWrap = e.target.closest('.option_wrap');
    //         const optionClick = e.target.closest('.option_list li');
    
    //         const liValue = e.target.attributes;
    //         const liTxt = e.target.innerText;
    
    //         if(listWrap){
    //             const hasActive = listWrap.classList.contains('active');
    //             listWrap.classList.add('active');
    //             if(hasActive){
    //                 listWrap.classList.remove('active');
    //             }
    //         }
    //         if(optionClick){
    //             listWrap.classList.add('has_value');
    //             // console.log(liValue)
    //             setClickLi(liTxt)
    //             return
    //         }

    //     };

    //     document.addEventListener('click', selectClick);
        
    //     return()=>{//clear
    //         document.addEventListener('click', selectClick);
    //     }
        
    // },[]);
    
    return(
        <div className={styles.selectCustom}>

            <InputTit inputTit={selectTit}/>
            <div 
            // className={`${styles.selectOption} option_wrap`}
                className={
                    `   ${styles.selectOption} 
                        option_wrap 
                        ${isOpen ? "active" : ""} 
                        ${clickLi !== defaultTxt ? "has_value" : ""}
                    `
                } 
                onClick={activeToggle} // 박스 클릭하면 열림/닫힘
                >
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
                            return(
                                <li key={index} data-value={index}
                                    onClick={(e) => liClick(option, e)}
                                >
                                    {option}
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
        </div>
    )
}