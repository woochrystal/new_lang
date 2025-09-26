// http://localhost:3000/groupware/vacation
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

// component
import PageTit from '@/shared/ui/Title/PageTit';
import InputTit from '@/shared/ui/Input/InputTit';
import InputBox from '@/shared/ui/Input/InputBox';
import Search from '@/shared/ui/Input/Search';
import BtnWrap from '@/shared/ui/Button/BtnWrap';
import Select from '@/shared/ui/Input/Select';
import SelectGray from '@/shared/ui/Input/SelectGray';
import InputHasAlert from '@/shared/ui/Input/InputHasAlert';
import CheckBox from '@/shared/ui/Input/CheckBox';
import RadioGroup from '@/shared/ui/Input/RadioGroup';
import PrimaryBtn from '@/shared/ui/Button/PrimaryBtn';
import SecondBtn from '@/shared/ui/Button/SecondBtn';
import BasicBtn from '@/shared/ui/Button/BasicBtn';
import TableLayout from '@/shared/ui/Table/TableList';
import TableBox from '@/shared/ui/Table/TableBox';
import Textarea from '@/shared/ui/Input/Textarea';
import InputFile from '@/shared/ui/Input/InputFile';
import InputFileBox from '@/shared/ui/Input/InputFileBox';
import FileBox from '@/shared/ui/uploadBox/FileBox';
import StatusBox from '@/shared/ui/uploadBox/StatusBox';
import EmptyUpBox from '@/shared/ui/uploadBox/EmptyUpBox';
import PostInfoBox from '@/shared/ui/Table/PostInfoBox';
import PostInfoTableRow from '@/shared/ui/Table/PostInfoTableRow';

// scss
import '@/shared/ui/Input/inputBasic.scss';
import styles from '@/shared/ui/Input/inputCustom.module.scss';
import styles02 from './layout.module.scss';

// 임시 예시 게시판(휴가관리)
export default function VacationExample() {
  const router = useRouter();
  const handleNavigate = () => {
    router.push('/groupware/compoments/layout01');
  };

  // pageTitCon 페이지 제목
  const pageTitCon = {
    pageTitle: '휴가 관리',
    pageInfo: '휴가를 상신하고 결재 상태를 조회할 수 있지만 지금은 컨포넌트 확인용'
  };

  //selectInfo 셀렉트인풋
  const select01 = {
    selectTit: '셀렉트제목1',
    list: [
      '전체',
      '연차',
      '반차',
      '병가',
      '경조사',
      '리프레시',
      '기타',
      '전체',
      '연차',
      '반차',
      '병가',
      '경조사',
      '리프레시',
      '기타'
    ],
    defaultTxt: '선택해주세요'
  };

  // 셀렉트 회색
  const select02 = {
    list: ['10건 보기', '20건 보기', '30건 보기'],
    defaultTxt: '20건 보기'
  };

  // textInfo 텍스트인풋
  const txtinput = {
    inputType: 'text',
    txtTit: '텍스트인풋제목',
    txtId: 'nickname',
    defaultTxt: '모델명 입력',
    essential: false
  };

  // 비밀번호
  const pwBox = {
    inputType: 'password',
    txtTit: '비밀번호',
    txtId: 'password',
    defaultTxt: '비밀번호를 입력해주세요',
    essential: true
  };

  // 테이블 헤드
  const tableHead = ['상신 일시', '기안자', '기안 부서', '휴가 종류', '휴가 기간', '휴가 일수', '진행 상태'];
  //테이블 바디
  const tableBody = [
    ['', '2025-08-25 14:14:14', '홍길동', '전략기획부', '연차', '2025-08-25 14:14:14', '2', '승인'],
    ['', '2025-08-26 14:14:15', '김길동', '전략기획', '반차', '2025-08-25 14:14:15', '1', '승인'],
    ['', '2025-08-25 14:14:14', '홍길동', '전략기획부', '연차', '2025-08-25 14:14:14', '2', '승인']
  ];

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

  // searchInfo 검색
  const search01 = {
    searchTit: '검색인풋',
    searchId: 'searchInput',
    defaultTxt: '모델명 검색',
    disabled: false
  };

  //기본 라디오버튼 + 값 확인용
  const [choice, setChoice] = useState('');
  const radioGroup01 = {
    name: 'radio input01',
    radioOp: [
      { radioTit: '라디오1', value: '1값' },
      { radioTit: '라디오2', value: '2값' },
      { radioTit: '라디오3', value: '3값' }
    ],
    onChange: (val) => setChoice(val) //값확인용
  };

  //버튼형식 라디오버튼(게시판 리스트에 사용) + 값 확인용
  const [choice02, setChoice02] = useState('');
  const radioGroup02 = {
    name: 'radio input02',
    radioOp: [
      { radioTit: '버튼1', value: '1값' },
      { radioTit: '버튼2', value: '2값' },
      { radioTit: '버튼3', value: '3값' }
    ],
    onChange: (val) => setChoice02(val) //값확인용
  };

  //Textarea
  const textarea01 = {
    inputTit: 'Textarea',
    essential: true
  };

  // 버튼명
  const btnName01 = '메인기능버튼';
  const btnName02 = '보조기능버튼';
  const btnName03 = '기본버튼';

  // 첨부파일 기본형
  const InputFile01 = {
    inputTit: '첨부파일 기본형',
    essential: true
  };

  // 첨부파일 버튼형(내정보)
  const fileBox01 = { inputTit: '프로필' };
  const fileBox02 = { inputTit: '자격증빙' };
  const fileBox03 = { inputTit: '경력증빙' };

  // 결재 상세 이력
  const fileBox04 = { inputTit: '팀장' };

  // searchInfo 검색
  const search02 = {
    // searchTit: '검색인풋',
    searchId: 'memberInputTeam',
    defaultTxt: '회원명',
    disabled: false
  };
  const search03 = {
    // searchTit: '검색인풋',
    searchId: 'memberInputCeo',
    defaultTxt: '회원명',
    disabled: false
  };
  const fileBox05 = { inputTit: '대표이사' };

  // PostInfoTable (th - td) 테이블
  // searchInfo 검색
  const PostInfoTable01 = {
    searchId: 'PostInfoTable',
    defaultTxt: '모델명 검색'
  };

  return (
    <div className="pageWrap">
      {/* 상단 현재 메뉴명 */}
      <PageTit pageTitCon={pageTitCon} />

      {/* pageScroll : 스크롤되는 페이지 내부 영역(PageTit 영역 제외) */}
      <div className="pageScroll">
        {/* 2 3 4의 배수 같은 크기로 가로 정렬 시 사용 */}
        <div className="hasItem03">
          {/* 셀렉트 */}
          <Select selectInfo={select01} />
          {/* 필수표시한 셀렉트 (테이블 목록용)*/}
          <SelectGray selectInfo={select02} />
          {/* 일반 텍스트 인풋 */}
          <InputBox txtInfo={txtinput} />
          {/* 검색 */}
          <Search searchInfo={search01} />
          {/* 비밀번호 인풋 */}
          <InputHasAlert txtInfo={pwBox} />

          <div>
            <div className="boxStyle">
              {/* 라디오버튼 그룹 */}
              <RadioGroup radioGroupInfo={radioGroup01} type="circle" />
              <p>클릭값:{choice}</p>
            </div>
            <div className="boxStyle">
              {/* 라디오버튼 그룹 */}
              <RadioGroup radioGroupInfo={radioGroup02} type="button" />
              <p>버튼:{choice02}</p>
            </div>
          </div>

          <div className={`${styles.rowArea} boxStyle`}>
            <BtnWrap className={'BtnWrap'}>
              {/* 메인버튼 디자인 */}
              <PrimaryBtn btnName={btnName01} onClick={handleNavigate} />
              {/* 보조버튼 디자인 */}
              <SecondBtn btnName={btnName02} />
              {/* 기본버튼 디자인 */}
              <BasicBtn btnName={btnName03} />
            </BtnWrap>
            <div className={`${styles.columnArea} ${styles.bgPurple} boxStyle`}>
              {/* 체크박스 기본 흰색 */}
              <CheckBox checkInfo={check01} />
              {/* 체크박스 보라색 */}
              <CheckBox checkInfo={check02} />
            </div>
          </div>

          <div>
            {/* Textarea */}
            <InputTit inputTit={textarea01.inputTit} essential={textarea01.essential} />
            <Textarea />
          </div>

          <div>
            {/* 첨부파일 기본 인풋 */}
            <InputTit inputTit={InputFile01.inputTit} essential={InputFile01.essential} />
            <InputFileBox />

            <div className="hasItem03">
              <div>
                <InputTit inputTit={fileBox01.inputTit + ' 파일 업로드'} />
                <FileBox inputTit={fileBox01.inputTit}></FileBox>
              </div>
              <div>
                <InputTit inputTit={fileBox02.inputTit + ' 파일 업로드'} />
                <FileBox inputTit={fileBox02.inputTit}></FileBox>
              </div>
              <div>
                <InputTit inputTit={fileBox03.inputTit} />
                <FileBox inputTit={fileBox03.inputTit}></FileBox>
              </div>
            </div>
          </div>

          <div className="hasItem03 btmCenter">
            <div className="btmLeft">
              <InputTit inputTit={fileBox04.inputTit} />
              <StatusBox searchInfo={search02} />
            </div>
            <div className="btmLeft">
              <InputTit inputTit={fileBox05.inputTit} />
              <StatusBox searchInfo={search03} />
            </div>
            <div className="btmLeft">
              <EmptyUpBox />
            </div>
          </div>

          {/* 한줄짜리 테이블 기본 ex) 게시물 작성 제목, 첨부파일부분 */}
          <div className="itemCol2">
            <PostInfoBox>
              <PostInfoTableRow
                row={[
                  // isTh : true 설정 시 th
                  { content: '제목', isTh: true },
                  // colspan : 숫자 지정 시 해당 숫자 만큼 colspan
                  { content: <input id="title" type="text" placeholder="제목 입력" />, colspan: 3 }
                ]}
              />
            </PostInfoBox>

            {/* 한줄짜리 테이블 2개 ex) 게시물 작성 제목, 첨부파일부분 */}
            <PostInfoBox colWidths={['120px', 'calc(50% - 120px)', '120px', 'calc(50% - 120px)']}>
              <PostInfoTableRow
                row={[
                  // isTh : true 설정 시 th
                  { content: '제목', isTh: true },
                  // colspan : 숫자 지정 시 해당 숫자 만큼 colspan
                  { content: <input id="title02" type="text" placeholder="제목 입력" />, colspan: 3 }
                ]}
              />
              <PostInfoTableRow
                row={[
                  { content: '제목', isTh: true },
                  { content: <input id="title03" type="text" placeholder="제목 입력" /> },
                  { content: '파일첨부', isTh: true },
                  { content: <InputFile /> }
                ]}
              />
            </PostInfoBox>
          </div>
        </div>
        {/* 테이블 */}
        <TableLayout theadList={tableHead} tbodyList={tableBody} />
        {/* 테이블 컴포넌트 나눈 버전 */}
        <TableBox theadList={tableHead} tbodyList={tableBody} />
      </div>
    </div>
  );
}
