'use client';
import { useState, useEffect } from 'react';
import RadioBtn from '@/shared/ui/Input/radioBtn';
import styles from "@/shared/ui/Input/radioCustom.module.scss"

export default function RadioGroup({radioGroupInfo}){
    const{defaultValue, name,radioOp,onChange} = radioGroupInfo;

    let valueSetting = '';
  
    if(defaultValue != undefined && defaultValue != null){
        valueSetting = defaultValue
    }else if(radioOp && radioOp.length > 0){
        valueSetting = radioOp[0].value;
    }

    const [radioClick, setRadioClick] = useState(valueSetting);//초기옵션
    useEffect(()=>{
        onChange(valueSetting);
    },[valueSetting, onChange]);//클릭할때 value 변경

    const radioValChange = (value) =>{
        setRadioClick(value);
        if(onChange){
        onChange(value);
        }

    }
    return(
        <div>
            {
                radioOp.map((option, i)=>(
                    <RadioBtn   key = {i}
                                radioTit = {option.radioTit}
                                value = {option.value}
                                checked = {radioClick == option.value}
                                onChange = {radioValChange}
                    />
                ))
            }
        </div>
    )
};