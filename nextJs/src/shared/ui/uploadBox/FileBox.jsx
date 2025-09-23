'use client';
import { useRef, useState } from 'react';
import styles from '@/shared/ui/uploadBox/uploadBox.module.scss';

export default function FileBox({ inputTit }) {
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const fileChange = (e) => {
    setFile(e.target.files[0] || null);
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; //클릭 시 input 초기화
    }
  };

  return (
    <div className={`${styles.uploadBox} ${styles.fileBox}`}>
      <label className={styles.inputFile}>
        <input type="file" name="" id="" ref={fileInputRef} onChange={fileChange} />
        <div className={styles.plusWrap}>
          <img src="/fileUploadPlus.svg" alt="추가" />
        </div>
      </label>
      <div className={`${styles.uploadBoxName} ${styles.fileBoxName}`}>
        {file ? (
          <div className={styles.fileDelete} onClick={removeFile}>
            <span>{file.name}</span>
            <i>
              <img src="/delete.png" alt="파일 삭제" />
            </i>
          </div>
        ) : (
          <span>{inputTit} 첨부</span>
        )}
      </div>
    </div>
  );
}
