// http://localhost:3000/groupware/compoments/layout01
/*
 * path           : app/groupware/{member}/compoments/layout01/page.jsx
 * fileName       : page.jsx
 * author         : Woo Sujeong
 * date           : 25. 09. 23.
 * description    : 서브페이지 레이아웃 퍼블리싱 확인용 파일
 * ===========================================================
 * DATE              AUTHOR        NOTE
 * -----------------------------------------------------------
 * 25. 09. 23.        Woo Sujeong       최초 생성
 */

'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Label } from '@/shared/component';

// component
import InputTit from '@/shared/ui/Input/InputTit';
import InputTxt from '@/shared/ui/Input/InputTxt';
import BtnWrap from '@/shared/ui/Button/BtnWrap';
import FullUpBox from '@/shared/ui/uploadBox/FullUpBox';
import InputDataWrap from '@/shared/ui/Input/InputDataWrap';
import ContLabel from '@/shared/ui/Title/ContLabel';
import InnerWrap from '@/shared/ui/Wrapper/InnerWrap';
import ConTit from '@/shared/ui/Title/ConTit';
import RadioCircle from '@/shared/ui/Input/RadioCircle';
import RadioButton from '@/shared/ui/Input/RadioButton';
import Wrapper from '@/shared/ui/Wrapper/Wrapper';

// 251016 컴포넌트 구조 변경 후 사용 안함
import SecondBtn from '@/shared/ui/Button/SecondBtn';
import StatusBox from '@/shared/ui/uploadBox/StatusBox';
import RadioGroup from '@/shared/ui/Input/RadioGroup';
import InputBox from '@/shared/ui/Input/InputBox';

//////////////// 더미데이터////////////////
// pageTitCon 페이지 제목
const pagetitcon = {
  pageTitle: '지출 품의서 참고',
  pageInfo: '레이아웃 확인용 페이지'
};

// 공통 레이아웃 확인용
export default function LayoutExample01() {
  const router = useRouter();
  return (
    <>
      {/* // 제목+ 버튼 같이 있는 경우 */}
      {/* <Wrapper className={'txtBtnWrap'}>
        <PageTit title={pagetitcon.pageTitle} description={pagetitcon.pageInfo} />
        <BtnWrap />
      </Wrapper> */}
      <BtnWrap className={'btnTitOnly'} />

      <Wrapper className={'content'}>
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
            <ContLabel />

            <Wrapper className={'roundedLgWrap'}>
              <InnerWrap className={'roundInnerLg'}>
                <InnerWrap className={'conTitWrap'}>
                  <ConTit>
                    <h3>조직정보는 3Depth까지 등록 가능합니다.</h3>
                    <BtnWrap />
                  </ConTit>
                  <Label required disabled>
                    필수 입력 정보입니다.
                  </Label>
                </InnerWrap>

                <InnerWrap className={'innerGray'}>
                  <div className={`depthSection hasItem03`}>
                    <div>
                      {/* 라디오버튼 그룹 */}
                      <InnerWrap className={`innerBox`}>
                        <RadioCircle />
                      </InnerWrap>
                    </div>
                    <div>
                      {/* 일반 텍스트 인풋 */}
                      <InputTxt />
                    </div>
                    <div>
                      {/* 일반 텍스트 인풋 */}
                      <InputTxt />
                    </div>

                    <div>
                      {/* 라디오버튼 그룹 */}
                      <InnerWrap className={`innerBox`}>
                        <RadioButton />
                      </InnerWrap>
                    </div>
                    <div>
                      {/* 일반 텍스트 인풋 */}
                      <InputTxt />
                    </div>
                    <div>
                      {/* 일반 텍스트 인풋 */}
                      <InputTxt />
                    </div>
                  </div>
                </InnerWrap>

                <InnerWrap>
                  <div className="hasItem03 largeGapSection">
                    <div>
                      {/* 일반 텍스트 인풋 */}
                      <InputTxt />
                    </div>
                    <div>
                      {/* 일반 텍스트 인풋 */}
                      <InputTxt />
                    </div>
                    <div>
                      {/* 일반 텍스트 인풋 */}
                      <InputTxt />
                    </div>
                    <div>
                      {/* 일반 텍스트 인풋 */}
                      <InputTxt />
                    </div>
                    <div>
                      {/* 일반 텍스트 인풋 */}
                      <InputTxt />
                    </div>
                  </div>
                </InnerWrap>
              </InnerWrap>
            </Wrapper>
          </Wrapper>
        </Wrapper>
      </Wrapper>
    </>
  );
}
