'use client';
import { useEffect, useState, useRef } from 'react';
import styles from './select.module.scss';

export default function Select() {
  //더미데이터
  const defaultTxt = '셀렉트';
  const list = ['전체', '연차', '반차', '병가', '경조사', '리프레시', '기타'];

  const [clickLi, setClickLi] = useState(defaultTxt);
  const [isOpen, setIsOpen] = useState(false); //열고닫기
  const selectRef = useRef(null);

  const activeToggle = () => {
    setIsOpen((prev) => !prev); //열고닫기
  };
  const liClick = (item, e) => {
    e.stopPropagation();
    setClickLi(item);
    setIsOpen(false); //선택하고 바로 닫음
  };

  //셀렉트 외 외부 클릭 시 닫힘
  useEffect(() => {
    const clickOut = (e) => {
      if (selectRef.current && !selectRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('click', clickOut);
    }
    return () => {
      document.removeEventListener('click', clickOut);
    };
  }, [isOpen]); //열리고 닫힐때만 인식

  return (
    <div className={styles.selectCustom} ref={selectRef}>
      <div
        className={`
          ${styles.selectOption}
          option_wrap
          ${isOpen ? 'active' : ''}
          ${clickLi !== defaultTxt ? 'has_value' : ''}
          `}
        onClick={activeToggle} //박스 클릭하면 열림/닫힘
      >
        <div>
          <p>
            {clickLi}
            <i>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <g opacity="0.8">
                  <path d="M5 7.5L10 12.5L15 7.5" strokeLinecap="round" strokeLinejoin="round" />
                </g>
              </svg>
            </i>
          </p>
        </div>
        <ul className="option_list">
          {list.map((option, index) => {
            return (
              <li key={index} onClick={(e) => liClick(option, e)}>
                {option}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
