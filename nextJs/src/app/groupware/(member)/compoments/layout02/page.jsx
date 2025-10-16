// http://localhost:3000/groupware/compoments/layout02 - 메인 레이아웃
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

// component
import PageTit from '@/shared/ui/Title/PageTit';
import MainTit from '@/shared/ui/Title/MainTit';
import DateCount from '@/shared/ui/Title/DateCount';

// layout component
import Wrapper from '@/shared/ui/Wrapper/Wrapper';
import InnerWrap from '@/shared/ui/Wrapper/InnerWrap';
import NumTag from '@/shared/ui/Tag/NumTag';
import ConTit from '@/shared/ui/Title/ConTit';
import List from '@/shared/ui/List/List';
import AssetsList from '@/shared/ui/List/AssetsList';
import BoardDocList from '@/shared/ui/List/BoardDocList';
import BoardList from '@/shared/ui/List/BoardList';
import ContLabel from '@/shared/ui/Title/ContLabel';
import QuickMenu from '@/shared/ui/List/QuickMenu';
import BtnWrap from '@/shared/ui/Button/BtnWrap';
import SecondBtn from '@/shared/ui/Button/SecondBtn';

//////////////// 더미데이터////////////////
const pageTitCon = {
  pageTitle: '지출 품의서 참고',
  pageInfo: '레이아웃 확인용 페이지'
};

const asset = {
  name: '모니터',
  num: 'NT-001',
  code: 'NT960QFG-K71AR'
};
const docList = {
  categori: '기안서',
  docNo: 'MU-202409-031',
  member: '박지현 사원',
  submit: '2025.09.08 10:10',
  content: '업무 효율 향상을 제고하기 위한 교육 신청서'
};

const board = {
  title: '공지사항 제목입니다. 공지사항 제목입니다. 공지사항 제목입니다.',
  submit: '2025.09.17 10:10',
  member: '박지현 사원'
};

// 메인 레이아웃 확인 게시판
export default function LayoutExample02() {
  const router = useRouter();
  return (
    <Wrapper className={'pageWrap'}>
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
            <List>
              <NumTag></NumTag>
            </List>
          </InnerWrap>

          <InnerWrap className={'mainInner'}>
            <ConTit>
              <h3>보유장비현황</h3>
              <BtnWrap className={'BtnWrap'}>
                <SecondBtn btnName={'보유장비확인'} />
              </BtnWrap>
            </ConTit>
            <List>
              <AssetsList name={asset.name} num={asset.num} code={asset.code} />
            </List>
          </InnerWrap>

          <InnerWrap className={'mainInner'}>
            <ConTit>
              <h3>퀵메뉴</h3>
            </ConTit>
            <List>
              <QuickMenu />
            </List>
          </InnerWrap>
        </Wrapper>

        <Wrapper className={'mainRight'}>
          <InnerWrap className={'mainInner'}>
            <ConTit>
              <h3>결재문서</h3>
            </ConTit>
            <List>
              <BoardDocList {...docList} />
            </List>
          </InnerWrap>

          <InnerWrap className={'mainInner'}>
            <ConTit>
              <h3>
                <ContLabel title={['공지사항', '사내게시판']} />
              </h3>
            </ConTit>
            <List>
              <BoardList {...board} />
            </List>
          </InnerWrap>
        </Wrapper>
      </Wrapper>
    </Wrapper>
  );
}
