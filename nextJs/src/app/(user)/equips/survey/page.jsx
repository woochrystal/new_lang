'use client';

import { useState, useEffect } from 'react';
import { equipApi } from '@/features/equip';
import { DataTable, Content, ContentLayout, Button, Select, Input, Loading, Textarea } from '@/shared/component';
import { useAlertStore } from '@/shared/store/alertStore';
import { USER_SURVEY_STATUS_OPTIONS } from '@/features/equip/script/constants';
import styles from '@/shared/component/layout/layout.module.scss';
import pageStyles from './page.module.scss';
import scrollbarStyles from '@/features/equip/ui/hide-scrollbar.module.scss';

export default function MySurveyPage() {
  const { showError, showSuccess } = useAlertStore();
  const [loading, setLoading] = useState({ surveys: true, submit: false });
  const [mySurveys, setMySurveys] = useState([]);
  const [selectedSurvId, setSelectedSurvId] = useState('');
  const [equipmentDetails, setEquipmentDetails] = useState([]);
  const [note, setNote] = useState('');

  const fetchMySurveys = async () => {
    setLoading((prev) => ({ ...prev, surveys: true }));
    const result = await equipApi.getMySurveyChecks();
    if (result && result.data) {
      setMySurveys(result.data);
      const initialDetails = result.data.map((survey) => ({
        eqpId: survey.eqpId,
        eqpSt: survey.eqpSt || '',
        note: survey.note || ''
      }));
      setEquipmentDetails(initialDetails);
    } else {
      showError('내 실사 목록을 불러오는데 실패했습니다.');
      setMySurveys([]);
    }
    setLoading((prev) => ({ ...prev, surveys: false }));
  };

  useEffect(() => {
    fetchMySurveys();
  }, []);

  const handleDetailChange = (eqpId, field, value) => {
    setEquipmentDetails((prevDetails) =>
      prevDetails.map((detail) => (detail.eqpId === eqpId ? { ...detail, [field]: value } : detail))
    );
  };

  const handleSubmit = async () => {
    if (!selectedSurvId) {
      showError('제출할 실사를 선택해주세요.');
      return;
    }

    const targetEquips = equipmentDetails.filter((d) =>
      mySurveys.some((s) => String(s.survId) === String(selectedSurvId) && String(s.eqpId) === String(d.eqpId))
    );

    for (const detail of targetEquips) {
      const equip = mySurveys.find((s) => String(s.eqpId) === String(detail.eqpId));

      if (!detail.eqpSt) {
        showError(`'${equip?.eqpNm || '자산'}'의 상태를 선택해주세요.`);
        return;
      }
      if (detail.eqpSt === 'NOT_IN_USE' && !detail.note.trim()) {
        showError(`'${equip?.eqpNm || '자산'}'의 상태가 '미보유'인 경우, 특이사항을 반드시 입력해야 합니다.`);
        return;
      }
    }

    setLoading((prev) => ({ ...prev, submit: true }));

    const submissionData = {
      survId: selectedSurvId,
      note: note,
      equipmentDetails: targetEquips
    };

    try {
      const result = await equipApi.submitSurvey(submissionData);

      if (result && !result.error) {
        showSuccess({ message: '실사가 성공적으로 제출되었습니다.' });
        fetchMySurveys();
        setSelectedSurvId('');
        setNote('');
      } else {
        throw new Error(result.error?.message || '알 수 없는 오류로 제출에 실패했습니다.');
      }
    } catch (error) {
      console.error('실사 제출 중 오류 발생:', error);
      showError(error.message);
    } finally {
      setLoading((prev) => ({ ...prev, submit: false }));
    }
  };

  const equipColumns = [
    { key: 'assetNo', label: '자산번호' },
    { key: 'eqpNm', label: '자산명' },
    { key: 'status', label: '상태' },
    { key: 'note', label: '특이사항' }
  ];

  const uniqueActiveSurveys = mySurveys.filter(
    (s, index, self) => index === self.findIndex((t) => t.survDesc === s.survDesc)
  );

  const filteredEquips = selectedSurvId ? mySurveys.filter((s) => String(s.survId) === String(selectedSurvId)) : [];

  const equipRenderers = {
    status: (value, row, index) => {
      const detail = equipmentDetails.find((d) => String(d.eqpId) === String(row.eqpId));
      const isTransferred = !detail?.eqpSt;
      return (
        <Select
          value={detail?.eqpSt || ''}
          onChange={(value) => handleDetailChange(row.eqpId, 'eqpSt', value)}
          options={USER_SURVEY_STATUS_OPTIONS}
          placeholder="상태 선택"
          className={`w-full ${isTransferred ? 'border-red-500' : ''}`}
        />
      );
    },
    note: (value, row, index) => (
      <Input
        value={equipmentDetails.find((d) => String(d.eqpId) === String(row.eqpId))?.note || ''}
        onChange={(e) => handleDetailChange(row.eqpId, 'note', e.target.value)}
      />
    )
  };

  return (
    <ContentLayout>
      <ContentLayout.Header title="내 실사 확인" subtitle="할당된 실사를 확인하고 보유 자산 현황을 제출합니다." />
      <Content.Full className={pageStyles.surveyContainer}>
        <div className={pageStyles.selectionBox}>
          <Select
            label="실사 선택"
            options={uniqueActiveSurveys.map((s) => ({ value: s.survId, label: s.survDesc }))}
            value={selectedSurvId}
            onChange={(value) => setSelectedSurvId(value)}
            placeholder="-- 완료할 실사를 선택하세요 --"
            disabled={loading.surveys || uniqueActiveSurveys.length === 0}
          />
        </div>

        <div className={styles.tableContainer}>
          <h3 className={pageStyles.equipListHeader}>실사 필요 자산 목록</h3>
          {loading.surveys ? (
            <Loading message="실사 목록을 불러오는 중..." />
          ) : (
            <div className={`${scrollbarStyles.noScrollbar}`}>
              <DataTable
                columns={equipColumns}
                data={filteredEquips}
                renderers={equipRenderers}
                keyField="eqpId"
                emptyMessage="선택된 실사에 해당하는 자산이 없습니다."
                className={pageStyles.stickyHeaderTable}
              />
            </div>
          )}
        </div>

        <div>
          <Textarea
            label="종합 비고"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="실사 전반에 대한 특이사항이나 전달할 내용이 있다면 작성해주세요."
            rows={4}
          />
        </div>

        <div className={pageStyles.buttonContainer}>
          <Button onClick={handleSubmit} disabled={loading.submit || !selectedSurvId} variant="primary">
            {loading.submit ? '제출 중...' : '실사 제출'}
          </Button>
        </div>
      </Content.Full>
    </ContentLayout>
  );
}
