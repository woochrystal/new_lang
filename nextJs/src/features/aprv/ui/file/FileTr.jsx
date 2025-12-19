'use client';

import FileInput from './FileInput';

/**
 * 파일 첨부 테이블 행 컴포넌트
 *
 * FileInput 컴포넌트를 테이블 행으로 래핑합니다.
 * 최대 5개의 파일까지 첨부 가능합니다.
 *
 * @param {Object} props
 * @param {string} [props.label='파일첨부'] - 테이블 헤더 레이블
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
 * @param {number} [props.thColSpan=1] - th의 colSpan 값
 * @param {number} [props.tdColSpan=3] - td의 colSpan 값
 */
const FileTr = (props) => {
  const {
    label = '파일첨부',
    id,
    fileState = { fileId: null, existing: [], new: [], deletedIds: [] },
    onChange,
    multiple = true,
    disabled = false,
    required = false,
    accept,
    thColSpan = 1,
    tdColSpan = 3
  } = props;

  return (
    <tr>
      <th colSpan={thColSpan}>{label}</th>
      <td colSpan={tdColSpan}>
        <FileInput
          variant="table"
          id={id}
          fileState={fileState}
          onChange={onChange}
          multiple={multiple}
          disabled={disabled}
          required={required}
          accept={accept}
        />
      </td>
    </tr>
  );
};

export default FileTr;
