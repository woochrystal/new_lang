// http://localhost:3000/groupware/vacation
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

// component
import PageTit from '@/shared/ui/Title/PageTit';
import InputTit from '@/shared/ui/Input/InputTit';
import InputTitAll from '@/shared/ui/Input/InputTitAll';
import InputTxt from '@/shared/ui/Input/InputTxt';
import InputFileBox from '@/shared/ui/Input/InputFileBox';
import BtnWrap from '@/shared/ui/Button/BtnWrap';
import BasicBtn from '@/shared/ui/Button/BasicBtn';
import Search from '@/shared/ui/Input/Search';
import Select from '@/shared/ui/Input/Select';
import SelectGray from '@/shared/ui/Input/SelectGray';
import Textarea from '@/shared/ui/Input/Textarea';
import PostInfoBox from '@/shared/ui/Table/PostInfoBox';
import StatusBox from '@/shared/ui/uploadBox/StatusBox';
import EmptyUpBox from '@/shared/ui/uploadBox/EmptyUpBox';
import CheckBox from '@/shared/ui/Input/CheckBox';
import RadioCircle from '@/shared/ui/Input/RadioCircle';
import RadioButton from '@/shared/ui/Input/RadioButton';
import TableBox from '@/shared/ui/Table/TableBox';
import Pagination from '@/shared/ui/Table/Pagination';

//scss
import '@/shared/ui/Input/inputBasic.scss';
import styles from '@/shared/ui/Input/inputCustom.module.scss';

//251015 컴포넌트 전체 퍼블리싱 수정 후 안쓰는 파일들
import InputBox from '@/shared/ui/Input/InputBox';
import InputHasAlert from '@/shared/ui/Input/InputHasAlert';
import RadioGroup from '@/shared/ui/Input/RadioGroup';
import PrimaryBtn from '@/shared/ui/Button/PrimaryBtn';
import SecondBtn from '@/shared/ui/Button/SecondBtn';
import InputFile from '@/shared/ui/Input/InputFile';
import FileBox from '@/shared/ui/uploadBox/FileBox';
import PostInfoTableRow from '@/shared/ui/Table/PostInfoTableRow';
import styles02 from './layout.module.scss';
import TableLayout from '@/shared/ui/Table/TableList';

// 임시 예시 게시판(휴가관리)
export default function VacationExample() {
  const router = useRouter();

  // pageTitCon 페이지 제목
  const pageTitCon = {
    pageTitle: '휴가 관리',
    pageInfo: '휴가를 상신하고 결재 상태를 조회할 수 있지만 지금은 컨포넌트 확인용'
  };

  //checkInfo 체크박스
  const check01 = {
    checkName: 'aa',
    checkId: 'aaa',
    checkTxt: '기본'
  };

  //checkInfo 체크박스 보라색
  const check02 = {
    checkName: 'bb',
    checkId: 'bbb',
    checkTxt: '흰색',
    fff: true //체크표시 흰색으로
  };

  return (
    <div className="pageWrap">
      {/* 상단 현재 메뉴명 */}
      <PageTit title={pageTitCon.pageTitle} description={pageTitCon.pageInfo} />

      {/* pageScroll : 스크롤되는 페이지 내부 영역(PageTit 영역 제외) */}
      <div className="pageScroll">
        {/* 2 3 4의 배수 같은 크기로 가로 정렬 시 사용 */}
        <div className="hasItem03">
          {/* 셀렉트 */}
          <Select />

          {/* 필수표시한 셀렉트 (테이블 목록용)*/}
          <SelectGray />

          {/* 일반 텍스트 인풋 */}

          <InputTxt />
          {/* 검색 */}
          <Search />

          {/* 비밀번호 인풋 */}
          {/* <InputHasAlert txtInfo={pwBox} /> */}

          {/* 라디오버튼 그룹컨포넌트는 삭제 */}
          <div className="boxStyle">
            <RadioCircle />
          </div>

          <div className="boxStyle">
            <RadioButton />
          </div>

          <div className="boxStyle">
            <BtnWrap className={'BtnWrap'}>
              {/* 버튼 디자인 3개*/}
              <BasicBtn />
            </BtnWrap>
          </div>

          <div className={`${styles.columnArea} ${styles.bgPurple} boxStyle`}>
            {/* 체크박스 기본 흰색 */}
            <CheckBox checkInfo={check01} />
            {/* 체크박스 보라색 */}
            <CheckBox checkInfo={check02} />
          </div>

          {/* 인풋 라벨 - 다른 라벨 디자인 확인해서 명칭 변경해도 좋을거같음 */}
          <div className="boxStyle">
            <InputTitAll />
          </div>

          {/* 첨부파일 기본 인풋 */}
          <InputFileBox />

          {/* Textarea */}
          <div>
            <Textarea />
          </div>

          <div className="hasItem03 btmCenter">
            {/* 기존 내정보 하단 개인정보 파일 업로드
              현재 디자인 바껴서 사용x ㅎ */}
            {/* <FileBox></FileBox> */}

            <div className="topLeft itemCol2">
              {/* 검색인풋 데이터추가 전+후 */}
              <InputTit>
                <span>{'인풋라벨명'}</span>
              </InputTit>
              <StatusBox />
            </div>
            <div className="btmLeft itemCol1">
              <EmptyUpBox />
            </div>
          </div>

          {/* 한줄짜리 테이블 기본 ex) 게시물 작성 제목, 첨부파일부분 */}
          <div className="itemCol2">
            <PostInfoBox />
          </div>
        </div>

        {/* 테이블 */}
        <TableBox />

        {/* 페이지네이션 */}
        <Pagination />
      </div>
    </div>
  );
}
