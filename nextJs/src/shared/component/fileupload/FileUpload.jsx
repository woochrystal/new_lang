'use client';

import { useRef, useState, useCallback } from 'react';

import { Label } from '@/shared/component';

import styles from './fileupload.module.scss';
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
 * @param {string} [props.accept=".pdf,.jpg,.jpeg,.png"] - 허용 파일 타입
 * @param {number} [props.maxSize=5242880] - 최대 파일 크기 (기본값: 5MB)
 * @param {string} [props.error=null] - 에러 메시지
 */
const FileUpload = ({
  label,
  fileType,
  fileState,
  onUpload,
  onDelete,
  required = false,
  accept = '.pdf,.jpg,.jpeg,.png',
  maxSize = 5 * 1024 * 1024, // 5MB
  error = null
}) => {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState(null);

  // 현재 파일명 가져오기
  const getFileName = () => {
    if (!fileState || fileState.deleted) return null;
    if (fileState.new) return fileState.new.name;
    if (fileState.saved) return fileState.saved.fileName || fileState.saved.orgFileNm || '기존 파일';
    return null;
  };

  const fileName = getFileName();
  const hasFile = !!fileName;

  const handleFileClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    (e) => {
      const selectedFile = e.target.files?.[0];
      if (!selectedFile) return;

      // 파일 크기 검증
      if (selectedFile.size > maxSize) {
        alert(`파일 크기는 ${maxSize / 1024 / 1024}MB를 초과할 수 없습니다.`);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }

      // 이미지 미리보기 로드
      if (selectedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        setPreview(null);
      }

      onUpload(fileType, selectedFile);
    },
    [fileType, maxSize, onUpload]
  );

  const handleDelete = useCallback(
    (e) => {
      e.stopPropagation();
      onDelete(fileType);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setPreview(null);
    },
    [fileType, onDelete]
  );

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const droppedFile = e.dataTransfer.files?.[0];
      if (droppedFile) {
        // 드롭된 파일도 같은 검증 로직 적용
        if (droppedFile.size > maxSize) {
          alert(`파일 크기는 ${maxSize / 1024 / 1024}MB를 초과할 수 없습니다.`);
          return;
        }

        // 이미지 미리보기 로드
        if (droppedFile.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setPreview(reader.result);
          };
          reader.readAsDataURL(droppedFile);
        } else {
          setPreview(null);
        }

        onUpload(fileType, droppedFile);
      }
    },
    [fileType, maxSize, onUpload]
  );

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleFileClick();
      }
    },
    [handleFileClick]
  );

  const fileNameClassName = `${styles.fileName} ${hasFile ? styles.hasFile : ''}`;

  return (
    <div className={`${inputStyles.wrapper}`}>
      <Label className={styles.fileLabel} required={required}>
        {label}
      </Label>

      <div
        className={`${styles.fileUploadBox} ${isDragging ? styles.dragging : ''}`}
        role="button"
        tabIndex={0}
        onClick={handleFileClick}
        onKeyDown={handleKeyDown}
        onDragEnter={handleDragEnter}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        aria-label={`${label} 파일 선택`}
      >
        <div className={`${inputStyles.inputFileWrap}`}>
          <div className={`${inputStyles.inputFile}`}>
            <input
              ref={fileInputRef}
              type="file"
              accept={accept}
              onChange={handleFileChange}
              required={required}
              aria-required={required}
              aria-label={`${label} 파일 선택`}
              className={`${inputStyles.input} ${inputStyles.searchInput}`}
            />

            {hasFile ? (
              <>
                {preview && (
                  <div className={styles.preview}>
                    <img src={preview} alt="미리보기" className={styles.imagePreview} />
                  </div>
                )}

                <div className={fileNameClassName}>
                  <span>{fileName}</span>
                </div>

                <button type="button" className={styles.deleteButton} onClick={handleDelete} aria-label="파일 삭제">
                  <img src="/delete.png" alt="" />
                </button>
              </>
            ) : (
              <div className={fileNameClassName}>
                <span>파일을 선택해주세요</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className={styles.errorMessage} role="alert">
          {error}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
