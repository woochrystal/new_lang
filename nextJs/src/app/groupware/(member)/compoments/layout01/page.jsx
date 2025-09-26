// http://localhost:3000/groupware/compoments/layout01
'use client';
import { useState } from 'react';

// component
import PageTit from '@/shared/ui/Title/PageTit';
import SecondBtn from '@/shared/ui/Button/SecondBtn';
import StatusBox from '@/shared/ui/uploadBox/StatusBox';
import InputTit from '@/shared/ui/Input/InputTit';
import BtnWrap from '@/shared/ui/Button/BtnWrap';
import Tag from '@/shared/ui/Tag/Tag';
import FullUpBox from '@/shared/ui/uploadBox/FullUpBox';

// layout component

import Wrapper from '@/shared/ui/Wrapper/Wrapper';

// 더미데이터
// pageTitCon 페이지 제목
const pageTitCon = {
  pageTitle: '지출 품의서 참고',
  pageInfo: '레이아웃 확인용 페이지'
};

const inputTit1 = '팀장';
const inputTit2 = '대표이사';

// 레이아웃 확인 게시판
export default function LayoutExample01() {
  return (
    <Wrapper className={'PageWrap'}>
      {/* <Wrapper className={'TxtBtnWrap'}>
        <PageTit pageTitCon={pageTitCon} />
        <BtnWrap className={'BtnWrap'}>
          <SecondBtn btnName={'버튼1'} />
          <SecondBtn btnName={'버튼2'} />
        </BtnWrap>
      </Wrapper> */}

      <BtnWrap className={'BtnTitOnly'}>
        <SecondBtn btnName={'버튼1'} />
        <SecondBtn btnName={'버튼2'} />
      </BtnWrap>

      <Wrapper className={'PageScroll'}>
        <Wrapper className={'PageLeftWrap'}>
          <div className="hasItem03">
            <div className="itemCol1">
              <InputTit inputTit={inputTit1} />
              <FullUpBox />
            </div>
            <div className="itemCol1">
              <InputTit inputTit={inputTit2} />
              <FullUpBox />
            </div>
          </div>
          <Wrapper className={'InputDataWrap'}>
            <InputTit inputTit={inputTit1} />
          </Wrapper>
        </Wrapper>

        <Wrapper className={'PageRightWrap'}>
          <Wrapper className={'RoundedLgWrap'}></Wrapper>
        </Wrapper>
      </Wrapper>
    </Wrapper>
  );
}
