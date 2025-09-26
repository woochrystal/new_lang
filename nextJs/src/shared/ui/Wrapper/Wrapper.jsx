// Wrapper className 사용방법
// -
// 'PageWrap' : 페이지 전체 wrapper
// 'PageLeftWrap' : 페이지 왼/오 나눠져있을때 스크롤 생기지 않는 왼쪽 부분
// 'PageRightWrap' : 페이지 왼/오 나눠져있을때 스크롤 생기는 오른쪽 부분
// 'PageScroll' : 페이지 내부 세로 스크롤 생성되는 영역
// 'RoundedLgWrap' : 선 + 흰배경 라운딩 사각 박스 테두리
// 'TxtBtnWrap' : BtnWrap.jsx TxtBtnWrap.jsx 를 감싸는 페이지명 + 버튼 wrapper
// 'UpBoxWrap' : 승인반려, 내정보 첨부파일 + 있는 업로드 박스..?
// 'InputDataWrap' : 인풋 결과값 보여주는 화면 wrapper

import React from 'react';
import styles from '@/shared/ui/Wrapper/wrapper.module.scss';

const Wrapper = React.forwardRef(({ children, className = '', ...rest }, ref) => {
  const containerClasses = [className && styles[className]].filter(Boolean).join(' ');
  return (
    <div ref={ref} className={containerClasses} {...rest}>
      {children}
    </div>
  );
});

export default Wrapper;
