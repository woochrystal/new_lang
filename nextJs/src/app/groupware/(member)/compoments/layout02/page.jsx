// http://localhost:3000/groupware/compoments/layout02 - 메인 레이아웃

/*
 * path           : app/groupware/{member}/compoments/layout02/page.jsx
 * fileName       : page.jsx
 * author         : Woo Sujeong
 * date           : 25. 10. 01.
 * description    : 메인보드 레이아웃/컴포넌트 퍼블리싱 확인용 파일
 * ===========================================================
 * DATE              AUTHOR        NOTE
 * -----------------------------------------------------------
 * 25. 10. 01.        Woo Sujeong       최초 생성
 */

'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

// component
import MainTit from '@/shared/ui/Title/MainTit';
import DateCount from '@/shared/ui/Title/DateCount';

// layout component
import Wrapper from '@/shared/ui/Wrapper/Wrapper';
import InnerWrap from '@/shared/ui/Wrapper/InnerWrap';
import NumTag from '@/shared/ui/List/NumTagList';
import ConTit from '@/shared/ui/Title/ConTit';
import AssetsList from '@/shared/ui/List/AssetsList';
import BoardDocList from '@/shared/ui/List/BoardDocList';
import BoardList from '@/shared/ui/List/BoardList';
import ContLabel from '@/shared/ui/Title/ContLabel';
import QuickMenu from '@/shared/ui/List/QuickMenu';
import BtnWrap from '@/shared/ui/Button/BtnWrap';

// 251016 컴포넌트 구조 변경 후 사용 안함
import SecondBtn from '@/shared/ui/Button/SecondBtn';
import List from '@/shared/ui/List/List';

// 메인 레이아웃 확인용
export default function LayoutExample02() {
  const router = useRouter();
  return (
    <Wrapper className={'mainPageWrap pageWrap'}>
      <Wrapper className={'txtBtnWrap'}>
        <MainTit>
          <DateCount />
        </MainTit>
      </Wrapper>

      <Wrapper className={'mainWrap'}>
        <Wrapper className={'mainLeft'}>
          <InnerWrap className={'mainNumTag'}>
            <ConTit>
              <h3>전자결재</h3>
            </ConTit>
            <NumTag />
          </InnerWrap>

          <InnerWrap className={'mainAssetsList'}>
            <ConTit>
              <h3>보유장비현황</h3>
              <BtnWrap className={'BtnWrap'} />
            </ConTit>
            <AssetsList />
          </InnerWrap>

          <InnerWrap className={'mainQuickMenu'}>
            <ConTit>
              <h3>퀵메뉴</h3>
            </ConTit>
            <QuickMenu />
          </InnerWrap>
        </Wrapper>

        <Wrapper className={'mainRight'}>
          <InnerWrap>
            <ConTit>
              <h3>결재문서</h3>
            </ConTit>
            <BoardDocList />
          </InnerWrap>

          {/* 게시물 + 탭 */}
          <InnerWrap>
            <ConTit>
              <h3>
                <ContLabel />
              </h3>
            </ConTit>
            <BoardList />
          </InnerWrap>
        </Wrapper>
      </Wrapper>
    </Wrapper>
  );
}
