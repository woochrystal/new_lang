import PageTit from "@/components/title/pageTit";
import Select from "@/components/input/select";
import InputTxt from "@/components/input/inputTxt";
import TableLayout from "@/components/table/table";

// 임시 예시 게시판(휴가관리)
export default function VacationExample(){

    // 페이지 타이틀
    const pageTitle = "휴가 관리";
    const pageInfo = "휴가를 상신하고 결재 상태를 조회할 수 있습니다.";

    // 테이블 헤드
    const select01 = ['전체','연차','반차','병가','경조사','리프레시', '기타'];
    const select02 = ['전체2','연차2','반차2','병가2','경조사2','리프레시2', '기타2'];

    //테이블 바디
    const tableHead = ['상신 일시', '기안자', '기안 부서', '휴가 종류', '휴가 기간', '휴가 일수', '진행 상태'];
    const tableBody = [
        ['','2025-08-25 14:14:14', '홍길동', '전략기획부', '연차', '2025-08-25 14:14:14', '2', '승인'],
        ['','2025-08-26 14:14:15', '김길동', '전략기획', '반차', '2025-08-25 14:14:15', '1', '승인'],
    ]; 



    return(
        <div>
            <div>
                <PageTit pageTitle={pageTitle} pageInfo={pageInfo}/>
            </div>
            <div>
                <Select selectTit='조회구분' list ={select01} defaultTxt='선택해주세요'/>
                <Select selectTit='조회구분2' list ={select02} defaultTxt='선택해주세요2'/>
                <InputTxt txtTit='텍스트'/>
            </div>
            <TableLayout theadList={tableHead} tbodyList={tableBody}/>
        </div>
    )
}