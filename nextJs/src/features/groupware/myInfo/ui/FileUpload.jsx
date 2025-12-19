'use client';

import { useRef } from 'react';

import { Label } from '@/shared/component';

import styles from './MyInfo.module.scss';
import inputStyles from '@/shared/component/input/input.module.scss';

/**
 * 파일 업로드 컴포넌트 (fileState 구조 지원)
 * @param {Object} props
 * @param {string} props.label - 파일 라벨
 * @param {string} props.fileType - 파일 타입 (educationFile, certificationFile, careerFile)
 * @param {Object} props.fileState - 파일 상태 { saved, new, deleted }
 * @param {Function} props.onUpload - 파일 업로드 핸들러 (fileType, file)
 * @param {Function} props.onDelete - 파일 삭제 핸들러 (fileType)
 * @param {boolean} [props.required=false] - 필수 여부 (별표 표시)
 */
const FileUpload = ({ label, fileType, fileState, onUpload, onDelete, required = false }) => {
  const fileInputRef = useRef(null);

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      onUpload(fileType, selectedFile);
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(fileType);
    // 파일 input 초기화
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSearch = (e) => {
    e.stopPropagation();
    // 로컬 서버이므로 파일 다운로드 기능 비활성화
    alert('로컬 환경에서는 파일 다운로드가 지원되지 않습니다.');
  };

  // 현재 파일명 가져오기
  const getFileName = () => {
    if (!fileState || fileState.deleted) return null;
    if (fileState.new) return fileState.new.name;
    if (fileState.saved) return fileState.saved.fileName || fileState.saved.orgFileNm || '기존 파일';
    return null;
  };

  const fileName = getFileName();
  const hasFile = !!fileName;
  const fileNameClassName = `${styles.fileName} ${hasFile ? styles.hasFile : ''}`;

  return (
    <div className={`${inputStyles.wrapper}`}>
      <Label className={styles.fileLabel} required={required}>
        {label}
      </Label>

      <div className="boxStyle">
        <div className={`${inputStyles.inputFileWrap}`} onClick={handleFileClick}>
          <div className={`${inputStyles.inputFile}`}>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              required={required}
              aria-required={required}
              className={`${styles.input} ${styles.searchInput}`}
            />

            {hasFile ? (
              <>
                <span>{fileName}</span>

                {fileState?.saved?.fileUrl && (
                  <i>
                    {/* <button type="button" className={inputStyles.searchButton} onClick={handleSearch} aria-label="파일 보기"> */}
                    {/* <img src="/search.png" alt="검색" /> */}
                    {/* </button> */}
                    <img src="/search.png" alt="검색" />
                  </i>
                )}

                {/* 삭제 버튼 - 저장된 파일이 없으면 searchButton 위치에 표시 */}
                <button
                  type="button"
                  className={fileState?.saved?.fileUrl ? inputStyles.clearButton : inputStyles.searchButton}
                  onClick={handleDelete}
                  aria-label="파일 삭제"
                >
                  <img src="/delete.png" alt="삭제" />
                </button>
              </>
            ) : (
              <div className={styles.fileName}>
                <span>파일을 선택해주세요</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
