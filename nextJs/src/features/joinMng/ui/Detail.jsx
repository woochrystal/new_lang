'use client';

import { useEffect, useState } from 'react';

import { Button, Label } from '@/shared/component';
import { api } from '../script/api';
import { JoinMng } from '@/features/joinMng';
import { useAlertStore } from '@/shared/store/alertStore';

import styles from '@/shared/component/popup/popup.module.scss';
import pageStyles from './JoinMng.module.scss';

import { format } from 'date-fns';
import { apiClient } from '@/shared/api';

const JoinMngDetail = function (props) {
  const { joinReqId, onBack, onDelete, onApprove, onReject } = props;

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const { showConfirm, showError } = useAlertStore.getState();

  const fetchData = async function (id) {
    setLoading(true);
    try {
      const apiData = await api.get(id);
      if (apiData) {
        setData(JoinMng.fromApi(apiData));
      } else {
        setData(null);
        showError('가입신청 정보를 찾을 수 없습니다.');
      }
    } catch (error) {
      console.error('가입신청 정보 조회 중 오류 발생:', error);
      setData(null);
      showError('가입신청 정보 조회 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(
    function () {
      if (joinReqId) {
        fetchData(joinReqId);
      }
    },
    [joinReqId]
  );

  const handleApprove = function () {
    showConfirm({
      title: '가입신청 승인',
      message: '선택한 가입신청을 승인하시겠습니까?',
      onConfirm: async function () {
        const result = await api.approve(joinReqId);

        if (result?.success === true) {
          if (onApprove) onApprove();
        } else {
          showError({
            title: '승인 오류',
            message: result?.error?.message || '승인 처리 중 오류가 발생했습니다.',
            variant: 'error'
          });
        }
      },
      confirmText: '승인',
      cancelText: '취소'
    });
  };

  const handleReject = function () {
    showConfirm({
      title: '가입신청 반려',
      message: '선택한 가입신청을 반려하시겠습니까?',
      onConfirm: async function () {
        const result = await api.reject(joinReqId);

        if (result?.success === true) {
          if (onReject) onReject();
        } else {
          showError({
            title: '반려 오류',
            message: result?.error?.message || '반려 처리 중 오류가 발생했습니다.',
            variant: 'error'
          });
        }
      },
      variant: 'warning',
      confirmText: '반려',
      cancelText: '취소'
    });
  };

  const handleDelete = function () {
    showConfirm({
      title: '가입신청 삭제',
      message: '선택한 가입신청을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.',
      onConfirm: async function () {
        try {
          await api.delete(joinReqId);
          if (onDelete) onDelete();
        } catch (error) {
          showError('삭제 처리 중 오류가 발생했습니다.');
        }
      },
      variant: 'danger',
      confirmText: '삭제',
      cancelText: '취소'
    });
  };

  const handleFileDownload = async function (fileDtlId, fileOrgNm) {
    try {
      const { data: downloadResponse } = await apiClient.get(`/api/common/files/download/${fileDtlId}`, {
        responseType: 'blob',
        _onSuccess: (response) => response
      });

      const blob = downloadResponse?.data;
      if (!blob) {
        throw new Error('빈 파일 응답입니다.');
      }

      const contentDisposition = downloadResponse.headers?.['content-disposition'];
      let fileName = fileOrgNm;
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

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {}
  };

  if (loading) {
    return <div className={pageStyles.loadingContainer}>로딩 중...</div>;
  }

  if (!data) {
    return (
      <div className={pageStyles.errorContainer}>
        <h2>가입신청 정보를 찾을 수 없습니다</h2>
        <Button variant="primary" onClick={onBack}>
          목록으로
        </Button>
      </div>
    );
  }

  const isPending = data.joinSt === 'PENDING';

  return (
    <>
      <div className={styles.modalTopBtnArea}>
        {isPending && (
          <>
            <Button variant="primary" onClick={handleApprove}>
              승인
            </Button>
            <Button variant="secondary" onClick={handleReject}>
              반려
            </Button>
            <Button onClick={handleDelete}>삭제</Button>
          </>
        )}
      </div>

      <div className={styles.modalContent}>
        <ul className={`${styles.modalInfoBlock} ${styles.modalInfoUl} hasItem02`}>
          <li>
            <Label required>기업명</Label>
            <div className={styles.modalInfoLi}>{data.tenantNm || ''}</div>
          </li>

          <li>
            <Label>도메인</Label>
            <div className={styles.modalInfoLi}>{data.domainPath || ''}</div>
          </li>

          <li>
            <Label required>사업자등록번호</Label>
            <div className={styles.modalInfoLi}>{data.bsnsRegNo || ''}</div>
          </li>

          <li>
            <Label required>사업자등록증</Label>
            <div className={styles.modalInfoLi}>
              {data.bsnsFileDtlId ? (
                <div
                  className={pageStyles.fileLink}
                  onClick={() => handleFileDownload(data.bsnsFileDtlId, data.bsnsFileNm)}
                >
                  {data.bsnsFileNm}
                </div>
              ) : (
                ''
              )}
            </div>
          </li>

          <li>
            <Label>담당자</Label>
            <div className={styles.modalInfoLi}>{data.mgrNm || ''}</div>
          </li>

          <li>
            <Label>담당자 이메일</Label>
            <div className={styles.modalInfoLi}>{data.mgrEmail || ''}</div>
          </li>

          <li>
            <Label>담당자 연락처</Label>
            <div className={styles.modalInfoLi}>{data.mgrTel || ''}</div>
          </li>

          <li>
            <Label>기업 로고</Label>
            <div className={styles.modalInfoLi}>
              {data.logoFileDtlId ? (
                <div
                  className={pageStyles.fileLink}
                  onClick={() => handleFileDownload(data.logoFileDtlId, data.logoFileNm)}
                >
                  {data.logoFileNm}
                </div>
              ) : (
                ''
              )}
            </div>
          </li>

          <li>
            <Label>회사 전화번호</Label>
            <div className={styles.modalInfoLi}>{data.tenantTel || ''}</div>
          </li>

          <li>
            <Label>주소</Label>
            <div className={styles.modalInfoLi}>{data.addr || ''}</div>
          </li>

          <li>
            <Label>승인상태</Label>
            <div className={styles.modalInfoLi}>{data.apprStatusNm || ''}</div>
          </li>

          <li>
            <Label>신청일</Label>
            <div className={styles.modalInfoLi}>
              {data.regDtm ? format(new Date(data.regDtm), 'yyyy-MM-dd HH:mm:ss') : ''}
            </div>
          </li>

          {data.note && (
            <li className={styles.inputTxt}>
              <Label>비고</Label>
              <div className={pageStyles.formValue}>{data.note || ''}</div>
            </li>
          )}
        </ul>
      </div>
    </>
  );
};

export default JoinMngDetail;
