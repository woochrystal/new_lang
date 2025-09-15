// http://localhost:3000/groupware/vacation
'use client';
import { useState } from 'react';

// component
import PageTit from '@/shared/ui/Title/PageTit';
import InputTit from '@/shared/ui/Input/InputTit';
import InputBox from '@/shared/ui/Input/InputBox';
import Search from '@/shared/ui/Input/Search';
import Select from '@/shared/ui/Input/Select';
import InputHasAlert from '@/shared/ui/Input/InputHasAlert';
import CheckBox from '@/shared/ui/Input/CheckBox';
import RadioGroup from '@/shared/ui/Input/RadioGroup';
import PrimaryBtn from '@/shared/ui/Button/PrimaryBtn';
import SecondBtn from '@/shared/ui/Button/SecondBtn';
import BasicBtn from '@/shared/ui/Button/BasicBtn';
import TableLayout from '@/shared/ui/Table/TableList';
import TableBox from '@/shared/ui/Table/TableBox';
import Textarea from '@/shared/ui/Input/Textarea';

// scss
import '@/shared/ui/Input/inputBasic.scss';
import styles from '@/shared/ui/Input/inputCustom.module.scss';
import styles02 from './layout.module.scss';

// 임시 예시 게시판(휴가관리)
export default function VacationExample() {
  // pageTitCon 페이지 제목
  const pageTitCon = {
    pageTitle: '휴가 관리',
    pageInfo: '휴가를 상신하고 결재 상태를 조회할 수 있습니다.'
  };

  //selectInfo 셀렉트인풋
  const select01 = {
    selectTit: '셀렉트제목1',
    list: ['전체', '연차', '반차', '병가', '경조사', '리프레시', '기타'],
    defaultTxt: '선택해주세요'
  };
  const select02 = {
    selectTit: '필수셀렉트별표시',
    list: ['전체2', '연차2', '반차2', '병가2', '경조사2', '리프레시2', '기타2'],
    defaultTxt: '선택해주세요2',
    essential: true //필수 별표시
  };

  // textInfo 텍스트인풋
  const txtinput = {
    inputType: 'text',
    txtTit: '텍스트인풋제목',
    txtId: 'nickname',
    defaultTxt: '모델명 입력',
    essential: false
  };
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
  const check02 = {
    checkName: 'bb',
    checkId: 'bbb',
    checkTxt: '흰색',
    fff: true //체크표시 흰색
  };

  // searchInfo 검색
  const search01 = {
    searchTit: '검색인풋',
    searchId: 'searchInput',
    defaultTxt: '모델명 검색',
    disabled: false
  };

  //라디오버튼값 확인용
  const [choice, setChoice] = useState('');

  const radioGroup01 = {
    name: 'radio input',
    radioOp: [
      { radioTit: '라디오1', value: '1값' },
      { radioTit: '라디오2', value: '2값' },
      { radioTit: '라디오3', value: '3값' }
    ],
    onChange: (val) => setChoice(val) //값확인용
  };
  const textarea01 = {
    inputTit: 'Textarea',
    essential: true
  };

  return (
    <div className="pageWrap">
      {/* 상단 현재 메뉴명 */}
      <PageTit pageTitCon={pageTitCon} />
      <div className={styles02.pageScroll}>
        <div className="inputAlign hasInput03">
          {/* 셀렉트 */}
          <Select selectInfo={select01} />
          {/* 필수표시한 셀렉트 */}
          <Select selectInfo={select02} />
          {/* 일반 텍스트 인풋 */}
          <InputBox txtInfo={txtinput} />
        </div>
        <div className="inputAlign hasInput03">
          {/* 검색 */}
          <Search searchInfo={search01} />
          {/* 비밀번호 인풋 */}
          <InputHasAlert txtInfo={pwBox} />
          <div>
            <div className={styles.columnArea}>
              {/* 체크박스 기본 흰색 */}
              <CheckBox checkInfo={check01} />
              {/* 체크박스 보라색 */}
              <CheckBox checkInfo={check02} />
            </div>
            <div className={styles.rowArea}>
              {/* 라디오버튼 그룹 */}
              <RadioGroup radioGroupInfo={radioGroup01} />
              <p>클릭값:{choice}</p>
            </div>
          </div>
        </div>
        <div className="inputAlign hasInput03">
          <div className={styles.rowArea}>
            <PrimaryBtn />
            <SecondBtn />
            <BasicBtn />
          </div>
          <div>
            {/* Textarea */}
            <InputTit inputTit={textarea01.inputTit} essential={textarea01.essential} />
            <Textarea />
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
