'use client';
import { useState } from 'react';

import styles from '@/shared/ui/Input/inputTxt.module.scss';
export default function InputFile() {
  const [fileList, setFileList] = useState([]);
  const [fileName, setFileName] = useState(<span>파일을 첨부해주세요.</span>);

  const fileChange = (e) => {
    const files = [...e.target.files];
    setFileList(files); //파일 선택해서 배열 저장

    if (files.length > 0) {
      //파일명 , 로 이어서 표시하기
      const names = files.map((file) => file.name).join(', ');
      setFileName(names);
    } else {
      setFileName(<span>파일을 첨부해주세요.</span>);
    }
  };
  const removeFile = (index) => {
    const newFiles = [...fileList]; //원본 배열 복사
    newFiles.splice(index, 1); //index 위치의 1개 아이템 삭제
    setFileList(newFiles);
  };

  // 기본 파일첨부 인풋 알맹이
  return (
    <div className={styles.inputFileWrap}>
      {/* <ul>
        {fileList.map((file, i) => (
          <li key={i}>{file.name}</li>
        ))}
      </ul> */}

      {/* span으로 하나씩 나오게01 - 파일명*/}
      {fileList.length > 0 ? (
        <div>
          {fileList.map((file, i) => (
            <div key={i} className={`${styles.fileNameBtn}`} onClick={() => removeFile(i)}>
              <span>{file.name}</span>
              <i>
                <img alt="검색어 작성 삭제" src="/delete.png" />
              </i>
            </div>
          ))}
        </div>
      ) : null}
      <label className={styles.inputFile}>
        {/* 글자 한줄로 나오게 */}
        {/* <span>{fileName}</span> */}

        {/* span으로 하나씩 나오게02 - 디폴트 문구*/}
        {fileList.length > 0 ? null : <span>파일을 첨부해주세요.</span>}

        <input type="file" name="" id="" multiple onChange={fileChange} />
        <i>
          <img alt="검색하기" src="/search.png" />
        </i>
      </label>
    </div>
  );
}
