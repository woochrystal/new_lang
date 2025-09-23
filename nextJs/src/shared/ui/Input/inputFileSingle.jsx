// 기본 파일첨부 인풋 알맹이(파일 1개 업로드 - 박스 레이아웃 합본)

'use client';
import { useState } from 'react';

import styles from '@/shared/ui/Input/inputTxt.module.scss';
export default function InputFileSingle() {
  const [fileList, setFileList] = useState([]);

  const fileChange = (e) => {
    setFileList([...e.target.files]);
    e.target.value = null; //리셋
  };

  const removeFile = (index) => {
    const newFiles = [...fileList]; //원본 배열 복사
    newFiles.splice(index, 1); //index 위치의 1개 아이템 삭제
    setFileList(newFiles);
  };

  return (
    <>
      {/* span으로 하나씩 나오게01 - 파일명*/}
      {fileList.length > 0 ? (
        <div className={`fileNameList`}>
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
          {/* span으로 하나씩 나오게02 - 디폴트 문구*/}
          {fileList.length == 0 ? (
            //0개 일 경우
            <span>파일을 첨부해주세요.</span>
          ) : (
            // 1개 일 경우
            <p className={styles.fileNameBtn}>
              <span>{fileList[0].name}</span>
            </p>
          )}

          <input type="file" name="" id="" onChange={fileChange} />
          <i>
            <img src="/search.png" alt="돋보기 아이콘" />
          </i>
        </label>
      </div>
    </>
  );
}
