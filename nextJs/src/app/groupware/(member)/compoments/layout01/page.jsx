// http://localhost:3000/groupware/compoments/layout01
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

// component
import PageTit from '@/shared/ui/Title/PageTit';
import SecondBtn from '@/shared/ui/Button/SecondBtn';
import StatusBox from '@/shared/ui/uploadBox/StatusBox';
import InputTit from '@/shared/ui/Input/InputTit';
import InputTxt from '@/shared/ui/Input/InputTxt';
import BtnWrap from '@/shared/ui/Button/BtnWrap';
import FullUpBox from '@/shared/ui/uploadBox/FullUpBox';
import InputDataWrap from '@/shared/ui/Input/InputDataWrap';
import ContLabel from '@/shared/ui/Title/ContLabel';
import InnerWrap from '@/shared/ui/Wrapper/InnerWrap';
import ConTit from '@/shared/ui/Title/ConTit';
import RadioGroup from '@/shared/ui/Input/RadioGroup';
import InputBox from '@/shared/ui/Input/InputBox';

// layout component

import Wrapper from '@/shared/ui/Wrapper/Wrapper';

//////////////// 더미데이터////////////////
// pageTitCon 페이지 제목
const pageTitCon = {
  pageTitle: '지출 품의서 참고',
  pageInfo: '레이아웃 확인용 페이지'
};

const inputTit1 = '팀장';
const inputTit2 = '대표이사';
const inputDataTit = '인풋데이터명';

//기본 라디오버튼 + 라벨
const radioGroup01 = {
  name: 'radio input01',
  radioOp: [
    { radioTit: '라디오1', value: '1값' },
    { radioTit: '라디오2', value: '2값' },
    { radioTit: '라디오3', value: '3값' }
  ]
};
const radioLabel = {
  inputTit: 'Textarea',
  essential: true
};
//기본 라디오버튼 + 라벨
const radioGroup02 = {
  name: 'radio input02',
  radioOp: [
    { radioTit: '라디오4', value: '4' },
    { radioTit: '라디오5', value: '5' },
    { radioTit: '라디오6', value: '6' }
  ]
};
const radioLabel2 = {
  inputTit: 'Textarea',
  essential: true
};
//기본 라디오버튼 + 라벨
const radioGroup03 = {
  name: 'radio input03',
  radioOp: [
    { radioTit: '라디오7', value: '7' },
    { radioTit: '라디오8', value: '8' },
    { radioTit: '라디오9', value: '9' }
  ]
};
const radioLabel3 = {
  inputTit: 'Textarea',
  essential: true
};
//기본 라디오버튼 + 라벨
const radioGroup04 = {
  name: 'radio input04',
  radioOp: [
    { radioTit: '디오12', value: '11' },
    { radioTit: '디오22', value: '22' },
    { radioTit: '디오32', value: '33' }
  ]
};
const radioLabel4 = {
  inputTit: 'Textarea',
  essential: true
};

// 레이아웃 확인 게시판
export default function LayoutExample01() {
  const router = useRouter();
  return (
    <Wrapper className={'pageWrap'}>
      {/*
      // 제목+ 버튼 같이 있는 경우
      <Wrapper className={'txtBtnWrap'}>
        <PageTit pageTitCon={pageTitCon} />
        <BtnWrap className={'BtnWrap'}>
          <SecondBtn btnName={'버튼1'} />
          <SecondBtn btnName={'버튼2'} />
        </BtnWrap>
      </Wrapper> */}

      <BtnWrap className={'btnTitOnly'}>
        <SecondBtn btnName={'버튼1'} />
        <SecondBtn btnName={'버튼2'} />
      </BtnWrap>

      <Wrapper className={'pageScroll'}>
        <Wrapper className={'pageLeftWrap'}>
          <div className="hasItem03">
            <div className="itemCol1">
              <InputTit />
              <FullUpBox />
            </div>
            <div className="itemCol1">
              <InputTit />
              <FullUpBox />
            </div>
          </div>
          <Wrapper className={'inputDataWrap'}>
            <div>
              <InputTit />
              <InputDataWrap />
            </div>
            <div>
              <InputTit />
              <InputDataWrap />
            </div>
            <div>
              <InputTit />
              <InputDataWrap />
            </div>
            <div>
              <InputTit />
              <InputDataWrap />
            </div>
            <div>
              <InputTit />
              <InputDataWrap />
            </div>
          </Wrapper>
        </Wrapper>

        <Wrapper className={'pageRightWrap'}>
          {/* <ContLabel title='지출 품의서'/> */}
          <ContLabel title={['지출 품의서', '지출 품의서22']} />

          <Wrapper className={'roundedLgWrap'}>
            <InnerWrap className={'roundInnerLg'}>
              <InnerWrap className={'conTitWrap'}>
                <ConTit>
                  <h3>조직정보는 3Depth까지 등록 가능합니다.</h3>
                  <p>필수 입력 정보입니다.</p>
                </ConTit>
                <BtnWrap className={'BtnWrap'}>
                  <SecondBtn btnName={'버튼1'} />
                  <SecondBtn btnName={'버튼2'} />
                </BtnWrap>
              </InnerWrap>

              <InnerWrap className={'innerGray'}>
                <div className="hasItem03">
                  <div>
                    {/* 라디오버튼 그룹 */}
                    <InputTit />
                    <InnerWrap className={`innerBox`}>
                      <RadioGroup radioGroupInfo={radioGroup01} type="circle" />
                    </InnerWrap>
                  </div>
                  <div>
                    {/* 일반 텍스트 인풋 */}
                    {/* <InputBox txtInfo={txtinput} disabled /> */}
                    <InputTxt />
                  </div>
                  <div>
                    {/* 일반 텍스트 인풋 */}
                    <InputTxt />
                  </div>

                  <div>
                    {/* 라디오버튼 그룹 */}
                    <InputTit />
                    <InnerWrap className={`innerBox`}>
                      <RadioGroup radioGroupInfo={radioGroup02} type="circle" />
                    </InnerWrap>
                  </div>
                  <div>
                    {/* 일반 텍스트 인풋 */}
                    {/* <InputBox txtInfo={txtinput} disabled /> */}
                    <InputTxt />
                  </div>
                  <div>
                    {/* 일반 텍스트 인풋 */}
                    {/* <InputBox txtInfo={txtinput} disabled /> */}
                    <InputTxt />
                  </div>
                </div>
              </InnerWrap>

              <InnerWrap className={'hasGap64'}>
                <div className="hasItem03">
                  <div>
                    {/* 라디오버튼 그룹 */}
                    <InputTit />
                    <InnerWrap className={`innerBox`}>
                      <RadioGroup radioGroupInfo={radioGroup03} type="circle" />
                    </InnerWrap>
                  </div>
                  <div>
                    {/* 일반 텍스트 인풋 */}
                    {/* <InputBox txtInfo={txtinput} disabled /> */}
                    <InputTxt />
                  </div>
                  <div>
                    {/* 일반 텍스트 인풋 */}
                    {/* <InputBox txtInfo={txtinput} disabled /> */}
                    <InputTxt />
                  </div>
                  <div>
                    {/* 일반 텍스트 인풋 */}
                    {/* <InputBox txtInfo={txtinput} disabled /> */}
                    <InputTxt />
                  </div>
                  <div>
                    {/* 일반 텍스트 인풋 */}
                    {/* <InputBox txtInfo={txtinput} disabled /> */}
                    <InputTxt />
                  </div>
                  <div>
                    {/* 일반 텍스트 인풋 */}
                    {/* <InputBox txtInfo={txtinput} disabled /> */}
                    <InputTxt />
                  </div>
                </div>
              </InnerWrap>
            </InnerWrap>
          </Wrapper>
        </Wrapper>
      </Wrapper>
    </Wrapper>
  );
}
