// http://localhost:3000/groupware/compoments/layout01
'use client';
import { useState } from 'react';

// component
import PageTit from '@/shared/ui/Title/PageTit';
import TitBtnWrap from '@/shared/ui/Title/TitBtnWrap';
import TopBtn from '@/shared/ui/Title/TopBtn';
import SecondBtn from '@/shared/ui/Button/SecondBtn';

// scss

// 더미데이터
// pageTitCon 페이지 제목
const pageTitCon = {
  pageTitle: '레이아웃 확인',
  pageInfo: '레이아웃 확인용 페이지'
};

// 레이아웃 확인 게시판
export default function LayoutExample01() {
  return (
    <div className="pageWrap">
      <TitBtnWrap>
        <PageTit pageTitCon={pageTitCon} />
        <TopBtn>
          <SecondBtn btnName={'버튼1'} />
          <SecondBtn btnName={'버튼2'} />
        </TopBtn>
      </TitBtnWrap>
    </div>
  );
}
