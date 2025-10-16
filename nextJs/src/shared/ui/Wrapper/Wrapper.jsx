// page 내부 큰 단위의 공통 레이아웃을 위한 컴포넌트
// Wrapper className 정리
// -
// 'pageWrap' : 페이지 전체 wrapper
// 'pageLeftWrap' : 페이지 왼/오 나눠져있을때 스크롤 생기지 않는 왼쪽 부분
// 'pageRightWrap' : 페이지 왼/오 나눠져있을때 스크롤 생기는 오른쪽 부분
// 'pageScroll' : 페이지 내부 세로 스크롤 생성되는 영역
// 'roundedLgWrap' : 선 + 흰배경 라운딩 사각 박스 테두리 (큰 영역)
// 'roundedSmWrap' : 선 + 흰배경 라운딩 사각 박스 테두리 (작은 영역 = )
// 'txtBtnWrap' : BtnWrap.jsx TxtBtnWrap.jsx 를 감싸는 페이지명 + 버튼 wrapper
// 'upBoxWrap' : 승인반려, 내정보 첨부파일 + 있는 업로드 박스..?
// 'inputDataWrap' : 인풋 결과값 보여주는 화면 wrapper
// 'mainWrap' : 메인화면 전체 wrapper
// 'mainLeft' : 메인 왼쪽 wrapper
// 'mainRight' : 메인 오른쪽 wrapper

import React from 'react';
import styles from '@/shared/ui/Wrapper/wrapper.module.scss';

const Wrapper = ({ children, className = '', ...rest }, ref) => {
  const containerClasses = [className, styles[className]].filter(Boolean).join(' ');
  return (
    <div ref={ref} className={containerClasses} {...rest}>
      {children}
    </div>
  );
};

export default Wrapper;
