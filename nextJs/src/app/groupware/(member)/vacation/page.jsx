'use client';
import { useState, useEffect } from 'react';
import '@/shared/ui/Input/inputBasic.scss';
import styles from '@/shared/ui/Input/inputCustom.module.scss';
import PageTit from '@/shared/ui/Title/pageTit';
import Select from '@/shared/ui/Input/select';
import InputTxt from '@/shared/ui/Input/inputTxt';
import TableLayout from '@/shared/ui/Table/table';
import Search from '@/shared/ui/Input/search';
import CheckBox from '@/shared/ui/Input/checkBox';
import RadioGroup from '@/shared/ui/Input/radioGroup';

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
  const txt01 = {
    txtTit : '텍스트인풋제목',
    txtId :"nickname",
    defaultTxt : "모델명 입력"
  }

  // 테이블 헤드
  const tableHead = ['상신 일시', '기안자', '기안 부서', '휴가 종류', '휴가 기간', '휴가 일수', '진행 상태'];
  //테이블 바디
  const tableBody = [
    ['', '2025-08-25 14:14:14', '홍길동', '전략기획부', '연차', '2025-08-25 14:14:14', '2', '승인'],
    ['', '2025-08-26 14:14:15', '김길동', '전략기획', '반차', '2025-08-25 14:14:15', '1', '승인'],
    ['', '2025-08-25 14:14:14', '홍길동', '전략기획부', '연차', '2025-08-25 14:14:14', '2', '승인'],
    ['', '2025-08-26 14:14:15', '김길동', '전략기획', '반차', '2025-08-25 14:14:15', '1', '승인'],
    ['', '2025-08-25 14:14:14', '홍길동', '전략기획부', '연차', '2025-08-25 14:14:14', '2', '승인'],
    ['', '2025-08-26 14:14:15', '김길동', '전략기획', '반차', '2025-08-25 14:14:15', '1', '승인'],
    ['', '2025-08-25 14:14:14', '홍길동', '전략기획부', '연차', '2025-08-25 14:14:14', '2', '승인'],
    ['', '2025-08-26 14:14:15', '김길동', '전략기획', '반차', '2025-08-25 14:14:15', '1', '승인']
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
    searchTit : '검색인풋', 
    searchId : 'searchInput', 
    defaultTxt : "모델명 검색",
    disabled : false,

  };

  //라디오버튼
  const [choice, setChoice] = useState('');

  const radioGroup01={
    name: 'radio',
    radioOp:[
      {radioTit: '라디오1', value: 'aaa', },
      {radioTit: '라디오2', value: 'bbb', },
      {radioTit: '라디오3', value: 'ccc', },
    ],
    onChange: (on) => setChoice(on)
  }

  return (
    <div>
      <PageTit pageTitCon={pageTitCon} />
      <div className="inputAlign hasInput03">
        <Select selectInfo={select01} />
        <Select selectInfo={select02} />
        <InputTxt txtInfo={txt01} />
      </div>
      <div className="inputAlign hasInput03">
        <Search searchInfo={search01} />
        <div>
          <div className={styles.columnArea}>
            <CheckBox checkInfo={check01} />
            <CheckBox checkInfo={check02} />
          </div>
          <div className={styles.rowArea}>
            {/* <RadioGroup radioGroupInfo={radioGroup01}/>
            <p>값:{choice}</p> */}
          </div>
        </div>
      </div>
      <TableLayout theadList={tableHead} tbodyList={tableBody} />
    </div>
  );
}
