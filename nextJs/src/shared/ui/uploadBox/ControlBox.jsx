import React from 'react';
import styles from '@/shared/ui/uploadBox/uploadBox.module.scss';
import styles02 from '@/shared/ui/Table/table.module.scss';
import styles03 from '@/shared/ui/Input/inputTxt.module.scss';

function ControlBox(props) {
  return (
    // controlBoxWrap 안에서 생성되어야 gap 유지
    <div className={`${styles.controlBoxWrap}`}>
      {/*
        데이터 있을 경우 - controlData
        controlForm에 사용된 글로벌 controlMemBox scss 클래스명은 필수 X
      */}
      <div className={`${styles.controlBox} ${styles.controlData}`}>
        <div className={styles.ctrlBoxLeft}>
          <div className={styles.ctrlLfTxtWrap}>
            <h4>관리자 권한</h4>
            <p>팀장 이상이 사용하는 권한입니다.</p>
          </div>
        </div>
        <div className={styles.ctrlBoxRight}>
          <span>10명</span>
        </div>
      </div>

      {/*
      데이터 입력 폼 - controlForm
      글로벌 controlMemBox scss 클래스명은 내부 table 스타일을 위해 필수로 있어야함
      */}
      <div className={`${styles.controlBox} ${styles.controlForm} controlMemBox`}>
        <div className={styles.ctrlBoxLeft}>
          {/* src\shared\ui\Table\PostInfoBox.jsx 컴포넌트에서 가져옴 */}
          <div className={styles02.postInfoBox}>
            <table className={styles02.table}>
              <colgroup>
                <col style={{ width: '120px' }} />
                <col style={{ width: 'calc(50% - 120px)' }} />
              </colgroup>
              <tbody>
                <tr>
                  <th colSpan={1}>권한명</th>
                  <td colSpan={3}>
                    {/* InputTxt - 기본 텍스트 인풋 */}
                    <div className={styles03.inputTxt}>
                      <input id={'example'} type={'text'} placeholder={'권한명을 입력해주세요'} />
                    </div>
                    {/* InputTxt end */}
                  </td>
                </tr>
                <tr>
                  <th colSpan={1}>권한설명</th>
                  <td colSpan={3}>
                    {/* InputTxt - 기본 텍스트 인풋 */}
                    <div className={styles03.inputTxt}>
                      <input id={'example02'} type={'text'} placeholder={'권한 설명을 입력해주세요'} />
                    </div>
                    {/* InputTxt end */}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          {/* PostInfoBox end */}
        </div>
        <div className={`${styles.ctrlSaveBtn} ${styles.ctrlBoxRight}`}>
          <button>저장</button>
        </div>
      </div>
    </div>
  );
}

export default ControlBox;
