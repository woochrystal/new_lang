// http://localhost:3000/groupware/dashboard - 대시보드
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
import { ContentMainLayout, Content } from '@/shared/component';

// 대시보드 메인 페이지
export default function Dashboard() {
  const router = useRouter();
  return (
    <>
      <ContentMainLayout>
        {/* <ContentLayout.Header title=""></ContentLayout.Header> */}
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
      </ContentMainLayout>

      {/*<Wrapper className={'mainPageWrap pageWrap'}>*/}
      {/*  <Wrapper className={'txtBtnWrap'}>*/}

      {/*  </Wrapper>*/}

      {/*  <Wrapper className={'mainWrap'}>*/}
      {/*    <Wrapper className={'mainLeft'}>*/}

      {/*    </Wrapper>*/}

      {/*    <Wrapper className={'mainRight'}>*/}

      {/*    </Wrapper>*/}
      {/*  </Wrapper>*/}
      {/*</Wrapper>*/}
    </>
  );
}
