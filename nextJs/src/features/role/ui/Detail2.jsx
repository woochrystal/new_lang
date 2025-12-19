'use client';

import React from 'react';
import uploadBoxStyles from '@/shared/ui/uploadBox/uploadBox.module.scss';
import tableStyles from '@/shared/ui/Table/table.module.scss';
import inputTxtStyles from '@/shared/ui/Input/inputTxt.module.scss';

const RoleForm = function ({ formData, onChange, onSave, isEditing }) {
  const buttonText = isEditing ? '저장' : '등록';

  return (
    <div className={`${uploadBoxStyles.controlBox} ${uploadBoxStyles.controlForm} controlMemBox`}>
      <div className={uploadBoxStyles.ctrlBoxLeft}>
        <div className={tableStyles.postInfoBox}>
          <table className={tableStyles.table}>
            <colgroup>
              <col style={{ width: '120px' }} />
              <col style={{ width: 'calc(50% - 120px)' }} />
            </colgroup>
            <tbody>
              <tr>
                <th colSpan={1}>권한명</th>
                <td colSpan={3}>
                  <div className={inputTxtStyles.inputTxt}>
                    <input
                      type="text"
                      placeholder="권한명을 입력해주세요"
                      value={formData.authNm}
                      onChange={(e) => onChange('authNm', e.target.value)}
                    />
                  </div>
                </td>
              </tr>
              <tr>
                <th colSpan={1}>권한설명</th>
                <td colSpan={3}>
                  <div className={inputTxtStyles.inputTxt}>
                    <input
                      type="text"
                      placeholder="권한 설명을 입력해주세요"
                      value={formData.authDesc}
                      onChange={(e) => onChange('authDesc', e.target.value)}
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className={`${uploadBoxStyles.ctrlSaveBtn} ${uploadBoxStyles.ctrlBoxRight}`} onClick={onSave}>
        <button>{buttonText}</button>
      </div>
    </div>
  );
};

export default RoleForm;
