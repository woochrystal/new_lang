// http://localhost:3000/groupware/compoments/layout01d

/*
 * path           : app/groupware/{member}/compoments/layout01d/page.jsx
 * fileName       : page.jsx
 * author         : Park ChangHyeon
 * date           : 25. 11. 04.
 * description    : 공통 레이아웃/기본 컴포넌트 프론트 변환 화면 scss 수정용 파일
 * ===========================================================
 * DATE              AUTHOR        NOTE
 * -----------------------------------------------------------
 * 25. 11. 04.        Park ChangHyeon       최초 생성
 */
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
//공통디자인 scss
import styles from '@/shared/component/layout/layout.module.scss';
//특정 스타일 추가 할 경우에만 별도 scss 파일 추가해서 수정해주세요
import layoutStyles from './page.module.scss';

// component
import InputDataWrap from '@/shared/ui/Input/InputDataWrap';
import Wrapper from '@/shared/ui/Wrapper/Wrapper';

// 251107 컴포넌트 구조 변경 후 사용 안함
import InputTit from '@/shared/ui/Input/InputTit';
import InputTxt from '@/shared/ui/Input/InputTxt';
import BtnWrap from '@/shared/ui/Button/BtnWrap';
import FullUpBox from '@/shared/ui/uploadBox/FullUpBox';
import ContLabel from '@/shared/ui/Title/ContLabel';
import InnerWrap from '@/shared/ui/Wrapper/InnerWrap';
import ConTit from '@/shared/ui/Title/ConTit';
import RadioCircle from '@/shared/ui/Input/RadioCircle';
import RadioButton from '@/shared/ui/Input/RadioButton';
import SecondBtn from '@/shared/ui/Button/SecondBtn';
import StatusBox from '@/shared/ui/uploadBox/StatusBox';
// import RadioGroup from '@/shared/ui/Input/RadioGroup';
import InputBox from '@/shared/ui/Input/InputBox';

import {
  Button,
  Content,
  ContentLayout,
  Input,
  Label,
  Radio,
  RadioGroup,
  Tab,
  Hr,
  ApprovalStatus
} from '@/shared/component';

//////////////// 더미데이터////////////////
// pageTitCon 페이지 제목
const pagetitcon = {
  pageTitle: '지출 품의서 참고',
  pageInfo: '레이아웃 확인용 페이지'
};

// 공통 레이아웃 확인용
export default function LayoutExample01() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('tab1');

  // 결재선 상태 관리
  const [approvals, setApprovals] = useState([
    {
      team: '전략기획부',
      position: '팀장',
      name: '홍길동',
      status: 'approved',
      datetime: '2025-10-10 13:13:20'
    },
    {
      team: '경영진',
      position: '대표',
      name: '이대장',
      status: 'rejected',
      datetime: '2025-10-10 13:13:20'
    }
  ]);

  // 선택 가능한 담당자 목록
  const approverList = [
    { team: '전략기획부', position: '팀장', name: '홍길동' },
    { team: '전략기획부', position: '과장', name: '이순신' },
    { team: '마케팅', position: '팀장', name: '장보고' },
    { team: '경영진', position: '대표', name: '김영희' },
    { team: '경영진', position: '부사장', name: '박세종' }
  ];
  return (
    <ContentLayout>
      {/*<Wrapper className={'pageWrap'}>*/}
      {/* // 제목+ 버튼 같이 있는 경우 */}
      {/* <Wrapper className={'txtBtnWrap'}> */}
      {/*   <PageTit title={pagetitcon.pageTitle} description={pagetitcon.pageInfo} /> */}
      <ContentLayout.Header title="조직관리" subtitle="조직도를 설계하고 직위 변경 및 위임과 부서 이동을 관리합니다.">
        {/*  <BtnWrap /> */}
        {/* <BtnWrap className={'btnTitOnly'}/> */}
        <Button variant="">수정</Button>
        {/* </Wrapper> // txtBtnWrap */}
      </ContentLayout.Header>

      {/* <Wrapper className={'pageScroll'}> */}
      <Content.Split>
        {/* <Wrapper className={'pageLeftWrap'}> */}
        <Content.Left>
          <div className="hasItem03">
            <div className="itemCol1">
              {/*<InputTit />*/}
              <Label size="xs" disabled>
                팀장
              </Label>
              {/*<FullUpBox />*/}
              <ApprovalStatus value={approvals[0]} datetime={approvals[0]?.datetime} readOnly />
            </div>
            <div className="itemCol1">
              {/*<InputTit />*/}
              <Label size="xs" disabled>
                대표이사
              </Label>
              {/*<FullUpBox />*/}
              <ApprovalStatus
                value={approvals[1]}
                datetime={approvals[1]?.datetime}
                onChange={(value) => {
                  const newApprovals = [...approvals];
                  newApprovals[1] = value;
                  setApprovals(newApprovals);
                }}
                onDelete={() => {
                  const newApprovals = [...approvals];
                  newApprovals[1] = {};
                  setApprovals(newApprovals);
                }}
                approverList={approverList}
              />
            </div>
          </div>
          <Wrapper className={'inputDataWrap'}>
            <div>
              {/*<InputTit />*/}
              <Label size="sm" disabled>
                인풋라벨명
              </Label>
              <InputDataWrap />
            </div>
            <div>
              {/*<InputTit />*/}
              <Label size="sm" disabled>
                인풋라벨명
              </Label>
              <InputDataWrap />
            </div>
            <div>
              {/*<InputTit />*/}
              <Label size="sm" disabled>
                인풋라벨명
              </Label>
              <InputDataWrap />
            </div>
            <div>
              {/*<InputTit />*/}
              <Label size="sm" disabled>
                인풋라벨명
              </Label>
              <InputDataWrap />
            </div>
            <div>
              {/*<InputTit />*/}
              <Label size="sm" disabled>
                인풋라벨명
              </Label>
              <InputDataWrap />
            </div>
            <div>
              {/*<InputTit />*/}
              <Label size="sm" disabled>
                인풋라벨명
              </Label>
              <InputDataWrap />
            </div>
            <div>
              {/*<InputTit />*/}
              <Label size="sm" disabled>
                인풋라벨명
              </Label>
              <InputDataWrap />
            </div>
          </Wrapper>
          {/* </Wrapper> // pageLeftWrap */}
        </Content.Left>

        {/* <Wrapper className={'pageRightWrap'}> */}
        <Content.Right>
          <Content.RightHeader>
            {/*<ContLabel />*/}
            <Tab
              tabs={[
                { label: '지출 품의서', value: 'tab1' },
                { label: '지출 품의서22', value: 'tab2' }
              ]}
              value={activeTab}
              onChange={setActiveTab}
            />
          </Content.RightHeader>

          {/*<Wrapper className={'roundedLgWrap'}> // Content.Right에서 처리 */}
          {/*  <InnerWrap className={'roundInnerLg'}>*/}
          <div className={`${styles.titleSection} ${styles.titleWithButtonSection}`}>
            <div className={styles.sectionTitle}>
              <h3>조직정보는 3Depth까지 등록 가능합니다.000</h3>
              <div className={styles.actionButtonContainer}>
                <Button variant="secondary">보조기능버튼</Button>
                <Button variant="secondary">보조기능버튼</Button>
              </div>
            </div>
            <Label required disabled>
              필수 입력 정보입니다.
            </Label>
          </div>

          {/*<InnerWrap className={'innerGray'}>*/}
          <div className={`hasItem03 ${styles.depthSection}`}>
            {/*<div className="hasItem03">*/}
            <div>
              {/* 라디오버튼 그룹 */}
              <RadioGroup
                label="Depth"
                options={[
                  { value: 'd1', label: '1Depth' },
                  { value: 'd2', label: '2Depth' },
                  { value: 'd3', label: '3Depth' }
                ]}
                value={'state getter'}
                onChange={(v) => {
                  `${v} is value, onChange = {setState(v)}`;
                }}
                required
                bordered
              />
              {/*<InnerWrap className={`innerBox`}>*/}
              {/*  <RadioCircle/>*/}
              {/*</InnerWrap>*/}
            </div>
            <div>
              {/* 일반 텍스트 인풋 */}
              {/*<InputTxt />*/}
              <Input
                value={' state value '}
                onChange={(f) => {
                  'f is changed value';
                }}
              />
            </div>
            <div>
              {/* 일반 텍스트 인풋 */}
              {/*<InputTxt />*/}
              <Input
                value={' state value '}
                onChange={(f) => {
                  'f is changed value';
                }}
              />
            </div>

            <div>
              {/* 라디오버튼 그룹 */}
              <RadioGroup
                // label="Depth"
                type="button"
                options={[
                  { value: '1m', label: '1개월' },
                  { value: '3m', label: '3개월' },
                  { value: '6m', label: '6개월' },
                  { value: '1y', label: '1년' }
                ]}
                value={'1y'} //"state getter"
                onChange={(v) => {
                  `${v} is value, onChange = {setState(v)}`;
                }}
                required
                // bordered
              />
              {/*<InnerWrap className={`innerBox`}>*/}
              {/*  <RadioButton/>*/}
              {/*</InnerWrap>*/}
            </div>
            <div>
              {/* 일반 텍스트 인풋 */}
              {/*<InputTxt />*/}
              <Input
                value={' state value '}
                onChange={(f) => {
                  'f is changed value';
                }}
              />
            </div>
            <div>
              {/* 일반 텍스트 인풋 */}
              {/*<InputTxt />*/}
              <Input
                value={' state value '}
                onChange={(f) => {
                  'f is changed value';
                }}
              />
            </div>
            {/*</div>*/}
            {/*</InnerWrap>*/}
          </div>
          {/*<InnerWrap className={'hasGap64'}>*/}
          <div className={`hasItem03 ${styles.largeGapSection}`}>
            {/*<div className="hasItem03">*/}
            <div>
              {/* 라디오버튼 그룹 */}
              <RadioGroup
                label="Depth"
                options={[
                  { value: 'r1', label: '라디오1' },
                  { value: 'r2', label: '라디오2' },
                  { value: 'r3', label: '라디오3' }
                ]}
                value={'state getter'}
                onChange={(v) => {
                  `${v} is value, onChange = {setState(v)}`;
                }}
                required
                bordered
              />
              {/*<InnerWrap className={`innerBox`}>*/}
              {/*  <RadioCircle/>*/}
              {/*</InnerWrap>*/}
            </div>
            <div>
              {/* 일반 텍스트 인풋 */}
              {/*<InputTxt />*/}
              <Input
                value={' state value '}
                onChange={(f) => {
                  'f is changed value';
                }}
              />
            </div>
            <div>
              {/* 일반 텍스트 인풋 */}
              {/*<InputTxt />*/}
              <Input
                value={' state value '}
                onChange={(f) => {
                  'f is changed value';
                }}
              />
            </div>
            <div>
              {/* 일반 텍스트 인풋 */}
              {/*<InputTxt />*/}
              <Input
                value={' state value '}
                onChange={(f) => {
                  'f is changed value';
                }}
              />
            </div>
            <div>
              {/* 일반 텍스트 인풋 */}
              {/*<InputTxt />*/}
              <Input
                value={' state value '}
                onChange={(f) => {
                  'f is changed value';
                }}
              />
            </div>
            <div>
              {/* 일반 텍스트 인풋 */}
              {/*<InputTxt />*/}
              <Input
                value={' state value '}
                onChange={(f) => {
                  'f is changed value';
                }}
              />
            </div>
            {/*</div>*/}
            {/*</InnerWrap>*/}
          </div>
          {/* </Wrapper> // roundedLgWrap */}
          {/* </Wrapper> // pageRightWrap */}
        </Content.Right>
        {/* </Wrapper> // pageScroll */}
      </Content.Split>
      {/* </Wrapper> // pageWrap */}
    </ContentLayout>
  );
}
