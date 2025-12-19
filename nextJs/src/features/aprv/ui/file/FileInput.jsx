'use client';

import { useState, useMemo } from 'react';
import Label from '@/shared/component/input/Label';
import inputStyles from '@/shared/component/input/input.module.scss';
import styles from './fileInput.module.scss';
import { useAlertStore } from '@/shared/store/alertStore';
import { APRV_CONSTANTS } from '@/features/aprv';
import { apiClient } from '@/shared/api';

/**
 * 파일 첨부 컴포넌트
 *
 * 최대 5개의 파일까지 첨부 가능합니다.
 *
 * @param {Object} props
 * @param {'file'|'table'} [props.variant='file'] - 변형 타입 ('file': 기본 스타일, 'table': 테이블용 심플 스타일)
 * @param {string} [props.id] - input ID (레이블 연결용)
 * @param {Object} [props.fileState] - 파일 상태 객체
 * @param {number|null} props.fileState.fileId - FILE_ID (null이면 신규)
 * @param {Array} props.fileState.existing - 기존 파일 [{fileDtlId, orgFileNm, ...}]
 * @param {Array} props.fileState.new - 신규 파일 [File, File, ...]
 * @param {Array} props.fileState.deletedIds - 삭제된 파일 ID [123, 456]
 * @param {Function} props.onChange - 파일 상태 변경 시 콜백 (newFileState 객체를 인자로 받음)
 * @param {boolean} [props.multiple=true] - 다중 파일 선택 가능 여부
 * @param {boolean} [props.disabled=false] - 비활성화 여부
 * @param {boolean} [props.required=false] - 필수 여부
 * @param {string} [props.accept] - 허용할 파일 타입 (예: "image/*", ".pdf,.doc")
 * @param {string} [props.label] - 레이블 텍스트 (variant='file'일 때만 사용)
 * @param {string} [props.placeholder='파일을 첨부해주세요.'] - placeholder 텍스트
 * @param {string} [props.className] - 추가 CSS 클래스
 */
const FileInput = (props) => {
  const {
    variant = 'file',
    id,
    fileState = { fileId: null, existing: [], new: [], deletedIds: [] },
    onChange,
    multiple = true,
    disabled = false,
    required = false,
    accept,
    label,
    placeholder = '파일을 첨부해주세요.',
    className = ''
  } = props;

  // 파일 리스트 hover 상태 관리
  const [hover, setHover] = useState(false);
  const [disableHover, setDisableHover] = useState(false);

  // Alert store
  const { showError } = useAlertStore();

  // wrapper 클래스 생성
  const wrapperClasses = [inputStyles.wrapper, className].filter(Boolean).join(' ');

  // 화면 표시용 파일 목록 계산 (삭제된 파일 제외)
  const displayFiles = useMemo(() => {
    const remainingExisting = fileState.existing.filter((f) => !fileState.deletedIds.includes(f.fileDtlId));
    return [...remainingExisting, ...fileState.new];
  }, [fileState]);

  // 파일 선택 핸들러
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    // 최대 파일 개수 체크 (현재 표시 중인 파일 + 새로 추가할 파일)
    if (displayFiles.length + selectedFiles.length > APRV_CONSTANTS.MAX_FILES) {
      showError({
        title: '파일 첨부 오류',
        message: `최대 ${APRV_CONSTANTS.MAX_FILES}개의 파일만 첨부할 수 있습니다. (현재: ${displayFiles.length}개)`,
        confirmText: '확인'
      });
      e.target.value = null;
      return;
    }

    // fileState.new 배열에 추가
    onChange({
      ...fileState,
      new: [...fileState.new, ...selectedFiles]
    });

    e.target.value = null; // 리셋

    // 마우스 이벤트 일시 비활성화 (hover 오류 방지)
    setDisableHover(true);
    setHover(false);

    setTimeout(() => {
      setDisableHover(false);
    }, 500);
  };

  // 파일 제거 핸들러
  const handleRemoveFile = (index) => {
    const fileToRemove = displayFiles[index];

    if (fileToRemove.fileDtlId) {
      // 기존 파일 삭제 (deletedIds에 추가)
      const newFileState = {
        ...fileState,
        deletedIds: [...fileState.deletedIds, fileToRemove.fileDtlId]
      };
      onChange(newFileState);
    } else {
      // 신규 파일 삭제 (new 배열에서 제거)
      const newFileState = {
        ...fileState,
        new: fileState.new.filter((f) => f !== fileToRemove)
      };
      onChange(newFileState);
    }
  };

  // 마우스 이벤트 핸들러
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

  // 파일명 추출 함수 (API 객체 또는 File 객체)
  const getFileName = (file) => {
    return file.orgFileNm || file.name || '파일';
  };

  // 파일 다운로드 핸들러
  const handleFileDownload = async (file) => {
    // 1. 신규 파일 (File 객체)인 경우 무시
    if (!file.fileDtlId) {
      return;
    }

    // 2. disabled 상태가 아니면 다운로드 안함 (수정 모드에서는 삭제만 가능)
    if (!disabled) {
      return;
    }

    try {
      // 3. API 호출 (_onSuccess 필수)
      const { data: downloadResponse } = await apiClient.get(`/api/common/files/download/${file.fileDtlId}`, {
        responseType: 'blob',
        _onSuccess: (response) => response
      });

      // 4. Blob 데이터 추출
      const blob = downloadResponse?.data;
      if (!blob) {
        throw new Error('빈 파일 응답입니다.');
      }

      // 5. Content-Disposition 헤더에서 파일명 추출 (옵션)
      const contentDisposition = downloadResponse.headers?.['content-disposition'];
      let fileName = file.orgFileNm;
      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (fileNameMatch && fileNameMatch[1]) {
          fileName = fileNameMatch[1].replace(/['"]/g, '');
          // UTF-8 인코딩된 파일명 처리
          if (fileName.includes('UTF-8')) {
            const utf8Match = fileName.match(/UTF-8''(.+)/);
            if (utf8Match) {
              fileName = decodeURIComponent(utf8Match[1]);
            }
          }
        }
      }

      // 6. 다운로드
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('파일 다운로드 실패:', error);
      showError({
        title: '파일 다운로드 실패',
        message: '파일을 내려받는 중 오류가 발생했습니다.',
        confirmText: '확인'
      });
    }
  };

  // 파일 입력 영역 렌더링 (공통)
  const renderFileInput = () => {
    return (
      <>
        {/* 파일 목록 hover 시 표시 */}
        {displayFiles.length > 0 ? (
          <div className={`fileNameList ${hover ? 'show' : ''}`}>
            {displayFiles.map((file, index) => (
              <div key={`${getFileName(file)}-${index}`} className={`${styles.fileNameBtn} fileNameBtn`}>
                <span onClick={() => handleFileDownload(file)}>{getFileName(file)}</span>
                {!disabled && (
                  <i>
                    <img src="/delete.png" alt="삭제" onClick={() => handleRemoveFile(index)} />
                  </i>
                )}
              </div>
            ))}
          </div>
        ) : null}

        {/* 파일 입력 필드 */}
        <div className={styles.inputFileWrap}>
          <label className={styles.inputFile}>
            {/* 선택된 파일 표시 */}
            {displayFiles.length === 0 ? (
              <span>{placeholder}</span>
            ) : displayFiles.length === 1 ? (
              <p className={styles.fileNameBtn}>
                <span>{getFileName(displayFiles[0])}</span>
              </p>
            ) : (
              <p className={styles.fileNameBtn}>
                <span>{getFileName(displayFiles[0])}</span> 외 {displayFiles.length - 1}개
              </p>
            )}

            <input
              type="file"
              id={id}
              name={id}
              multiple={multiple}
              onChange={handleFileChange}
              disabled={disabled}
              accept={accept}
            />
            {!disabled && (
              <i>
                <img src="/search.png" alt="돋보기 아이콘" />
              </i>
            )}
          </label>
        </div>
      </>
    );
  };

  // variant='table': 테이블용 심플 스타일 (InputFile과 동일)
  if (variant === 'table') {
    return (
      <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        {renderFileInput()}
      </div>
    );
  }

  // variant='file': 기본 스타일 (wrapper, label, boxStyle 포함)
  return (
    <div className={wrapperClasses}>
      {/* 레이블 - Input.jsx의 Label 컴포넌트 사용 방식 */}
      {label && (
        <Label htmlFor={id} required={required}>
          {label}
        </Label>
      )}

      {/* 파일 입력 박스 - InputFileBox.jsx 구조 참고 */}
      <div className="boxStyle" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        {renderFileInput()}
      </div>
    </div>
  );
};

export default FileInput;
