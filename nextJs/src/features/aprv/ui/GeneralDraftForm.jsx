'use client';

import { memo, useCallback } from 'react';
import ConTit from '@/shared/ui/Title/ConTit';
import InnerWrap from '@/shared/ui/Wrapper/InnerWrap';
import styles from '@/shared/ui/Table/table.module.scss';
import layoutStyles from '@/shared/component/layout/layout.module.scss';
import { Editor } from '@/shared/component';
import { FileTr } from '@/features/aprv';

/**
 * 일반 결재 정보 입력 컴포넌트
 * @param {Object} props
 * @param {Object} props.data - 일반결재 상신 정보 (geneDraftInfo)
 * @param {string} props.data.aprvTitle - 결재 제목
 * @param {string} props.data.aprvCtt - 결재 내용
 * @param {Object} props.data.fileState - 파일 상태
 * @param {number|null} props.data.fileState.fileId - FILE_ID
 * @param {Array} props.data.fileState.existing - 기존 파일 목록
 * @param {Array} props.data.fileState.new - 신규 파일 목록
 * @param {Array} props.data.fileState.deletedIds - 삭제된 파일 ID
 * @param {Function} props.onChange - 데이터 변경 핸들러
 * @param {Object} props.user - 로그인 사용자 정보
 * @param {boolean} [props.disabled=false] - 비활성화 여부
 */
const GeneralDraftForm = memo((props) => {
  const { data, onChange, user, disabled = false } = props;

  // HTML 엔티티 디코딩 함수
  const decodeHtmlEntities = (html) => {
    if (!html) return '';
    const textarea = document.createElement('textarea');
    textarea.innerHTML = html;
    return textarea.value;
  };

  // onChange를 직접 사용하여 의존성 최소화
  const handleEditorChange = useCallback(
    (newContent) => {
      onChange((prev) => ({
        ...prev,
        aprvCtt: newContent
      }));
    },
    [onChange]
  );

  const handleFilesChange = useCallback(
    (newFileState) => {
      onChange((prev) => ({
        ...prev,
        fileState: newFileState
      }));
    },
    [onChange]
  );

  const handleTitleChange = useCallback(
    (e) => {
      onChange((prev) => ({
        ...prev,
        aprvTitle: e.target.value
      }));
    },
    [onChange]
  );

  return (
    <>
      <InnerWrap className={'conTitWrap'}>
        <ConTit>
          <h3>일반 결재 작성</h3>
        </ConTit>
        {/*<p>* 필수 입력 정보입니다.</p>*/}
      </InnerWrap>

      <div className={`${layoutStyles.depthSection} ${layoutStyles.noBgBd}`}>
        <div className={`${styles.postInfoBox}`}>
          <table className={styles.table}>
            <tbody>
              <tr>
                <th colSpan={1}>제목</th>
                <td colSpan={3}>
                  <input
                    type="text"
                    placeholder="일반결재 제목을 입력해주세요"
                    value={data.aprvTitle}
                    onChange={handleTitleChange}
                    disabled={disabled}
                  />
                  {/*<Input variant={'text'} value={data.aprvTitle} onChange={(v)=>handleChange('aprvTitle', v)}/>*/}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className={`${layoutStyles.boardDetail}`}>
          <div className={`${layoutStyles.content}`}>
            {disabled ? (
              <div className={`${styles.postInfoBox} postInfoBox`}>
                <div
                  className={`${styles.postInfoEmpty}`}
                  dangerouslySetInnerHTML={{ __html: decodeHtmlEntities(data.aprvCtt) || '<p>내용이 없습니다.</p>' }}
                />
              </div>
            ) : (
              <Editor
                id="content"
                content={decodeHtmlEntities(data.aprvCtt)}
                onChange={handleEditorChange}
                height={300}
              />
            )}
          </div>
        </div>

        <div className={'hasItem03'}>
          <div className={`${styles.postInfoBox} postInfoBox`}>
            <table className={styles.table}>
              <tbody>
                <FileTr
                  id="aprv-files"
                  label="파일첨부"
                  fileState={data.fileState}
                  onChange={handleFilesChange}
                  multiple={true}
                  disabled={disabled}
                />
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
});

GeneralDraftForm.displayName = 'GeneralDraftForm';

export default GeneralDraftForm;
