// 기본 파일첨부 인풋 알맹이(여러 파일 업로드)

'use client';
import { useState } from 'react';

import styles from '@/shared/ui/Input/inputTxt.module.scss';
export default function InputFile() {
  const [fileList, setFileList] = useState([]);

  //파일 올리는 즉시 파일 리스트 뜨는 hover 오류 위한 useState
  const [hover, setHover] = useState(false);
  const [disableHover, setDisableHover] = useState(false);

  const fileChange = (e) => {
    setFileList([...e.target.files]);
    e.target.value = null; //리셋

    // 마우스 이벤트 일시 비활성화
    setDisableHover(true);
    setHover(false);

    // 0.05초 후 다시 활성화
    setTimeout(() => {
      setDisableHover(false);
    }, 50);
  };

  const removeFile = (index) => {
    const newFiles = [...fileList]; //원본 배열 복사
    newFiles.splice(index, 1); //index 위치의 1개 아이템 삭제
    setFileList(newFiles);
  };

  const handleMouseEnter = () => {
    if (!disableHover) {
      setHover(true);
    }
  };

  const handleMouseLeave = () => {
    if (!disableHover) {
      setHover(false);
    }
  };

  return (
    <div
      onMouseEnter={handleMouseEnter} //마우스 올렸을떄 fileNameList에 class 추가
      onMouseLeave={handleMouseLeave}
    >
      {/* span으로 하나씩 나오게01 - 파일명*/}
      {fileList.length > 0 ? (
        <div className={`fileNameList ${hover ? 'show' : ''}`}>
          {fileList.map((file, i) => (
            <div key={i} className={`${styles.fileNameBtn} fileNameBtn`} onClick={() => removeFile(i)}>
              <span>{file.name}</span>
              <i>
                <img src="/delete.png" alt="삭제" />
              </i>
            </div>
          ))}
        </div>
      ) : null}
      <div className={styles.inputFileWrap}>
        <label className={styles.inputFile}>
          {/* 글자 한줄로 나오게 */}
          {/* <span>{fileName}</span> */}

          {/* span으로 하나씩 나오게02 - 디폴트 문구*/}
          {fileList.length == 0 ? (
            //0개 일 경우
            <span>파일을 첨부해주세요.</span>
          ) : fileList.length == 1 ? (
            // 1개 일 경우
            <p className={styles.fileNameBtn}>
              <span>{fileList[0].name}</span>
            </p>
          ) : (
            //2개 이상 일 경우
            <p className={styles.fileNameBtn}>
              <span>{fileList[0].name}</span> 외 {fileList.length - 1}개
            </p>
          )}

          <input type="file" name="" id="" multiple onChange={fileChange} />
          <i>
            <img src="/search.png" alt="돋보기 아이콘" />
          </i>
        </label>
      </div>
    </div>
  );
}
