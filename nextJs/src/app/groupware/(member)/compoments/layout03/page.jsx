// http://localhost:3000/groupware/compoments/layout03

/*
 * path           : app/groupware/{member}/compoments/layout03/page.jsx
 * fileName       : page.jsx
 * author         : Woo Sujeong
 * date           : 25. 10. 21.
 * description    : 공통 레이아웃/ 조직도 트리 퍼블리싱 확인용 파일
 * ===========================================================
 * DATE              AUTHOR        NOTE
 * -----------------------------------------------------------
 * 25. 10. 21.        Woo Sujeong       최초 생성
 */

'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

// component
import BtnWrap from '@/shared/ui/Button/BtnWrap';
import ContLabel from '@/shared/ui/Title/ContLabel';
import InnerWrap from '@/shared/ui/Wrapper/InnerWrap';
import Wrapper from '@/shared/ui/Wrapper/Wrapper';
import PageTit from '@/shared/ui/Title/PageTit';
import ControlBox from '@/shared/ui/uploadBox/ControlBox';
import Datepicker from '@/shared/ui/Input/Datepicker';
import DatepickerGroup from '@/shared/ui/Input/DatepickerGroup';
import NameTag from '@/shared/ui/Tag/NameTag';

import { Tree } from '@/shared/component';

//////////////// 더미데이터////////////////
// pageTitCon 페이지 제목
const pagetitcon = {
  pageTitle: '메뉴 권한 관리',
  pageInfo: '메뉴별 권한 레이아웃 확인 페이지'
};
const treeData = [
  {
    key: '1',
    title: '금융사업본부',
    children: [
      { key: '1-1', title: '전략기획부', children: [{ key: '1-1-1', title: '기은' }] },
      {
        key: '1-2',
        title: '마케팅팀',
        children: [
          { key: '1-2-1', title: '수정' },
          { key: '1-2-2', title: '혜민' }
        ]
      }
    ]
  },
  {
    key: '2',
    title: '대표실',
    children: [{ key: '2-1', title: '대표님' }]
  },
  {
    key: '3',
    title: '테스트',
    children: [
      { key: '3-1', title: '가나다' },
      { key: '3-2', title: '라마바' }
    ]
  }
];

// 메뉴 권한 관리 레이아웃 확인용
export default function LayoutExample03() {
  const router = useRouter();
  const [checkedKeys, setCheckedKeys] = useState([]);
  return (
    <>
      {/* // 제목+ 버튼 같이 있는 경우 */}
      <Wrapper className={'txtBtnWrap'}>
        <PageTit title={pagetitcon.pageTitle} description={pagetitcon.pageInfo} />
        <BtnWrap />
      </Wrapper>

      <Wrapper className={'content'}>
        <Wrapper className={'pageScroll'}>
          <Wrapper className={'pageLeftWrap'}>
            <ControlBox />
            <div>
              <Datepicker />
              <DatepickerGroup />
              <NameTag />
              <NameTag />
              <NameTag />
              <NameTag />
              <NameTag />
              <NameTag />
              <NameTag />
              <NameTag />
            </div>
          </Wrapper>

          <Wrapper className={'pageRightWrap'}>
            <ContLabel />

            <Wrapper className={'roundedLgWrapGray'}>
              <InnerWrap className={'roundInnerLg'}>
                <Tree
                  data={treeData}
                  // checkable
                  selectionMode={'single'}
                  checkedKeys={checkedKeys}
                  onCheckedChange={setCheckedKeys}
                  selectable
                  defaultExpandAll
                  // showIcon={true}
                />
              </InnerWrap>
            </Wrapper>
          </Wrapper>
        </Wrapper>
      </Wrapper>
    </>
  );
}
