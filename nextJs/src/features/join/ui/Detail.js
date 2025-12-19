'use client';

import React, { useState } from 'react';

import { Button, Modal } from '@/shared/component';
import inputTxtStyles from '@/shared/ui/Input/inputTxt.module.scss';

import styles from './Join.module.scss';

const JoinDetail = function ({ agreements, onAgreementChange }) {
  // 모달 상태
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: '',
    title: '',
    content: ''
  });

  // 약관 모달 열기
  const openAgreementModal = function (type) {
    const modalContent = {
      privacy: {
        title: '개인정보 수집 및 이용에 대한 안내',
        content:
          '개인정보 수집 및 이용에 대한 안내가 들어갈 부분입니다.\n\n본 내용은 실제 서비스 운영 시 법률 검토를 거친 정식 약관으로 교체되어야 합니다.\n\n본 내용은 실제 서비스 운영 시 법률 검토를 거친 정식 약관으로 교체되어야 합니다.\n\n본 내용은 실제 서비스 운영 시 법률 검토를 거친 정식 약관으로 교체되어야 합니다.\n\n본 내용은 실제 서비스 운영 시 법률 검토를 거친 정식 약관으로 교체되어야 합니다.\n\n본 내용은 실제 서비스 운영 시 법률 검토를 거친 정식 약관으로 교체되어야 합니다.\n\n본 내용은 실제 서비스 운영 시 법률 검토를 거친 정식 약관으로 교체되어야 합니다.\n\n본 내용은 실제 서비스 운영 시 법률 검토를 거친 정식 약관으로 교체되어야 합니다.'
      },
      marketing: {
        title: '마케팅 활용 및 광고성 정보 수신 동의',
        content:
          '마케팅 활용 및 광고성 정보 수신 동의 내용이 들어갈 부분입니다.\n\n본 내용은 실제 서비스 운영 시 법률 검토를 거친 정식 약관으로 교체되어야 합니다.'
      },
      terms: {
        title: '이용약관',
        content:
          '이용약관 내용이 들어갈 부분입니다.\n\n본 내용은 실제 서비스 운영 시 법률 검토를 거친 정식 약관으로 교체되어야 합니다.'
      }
    };

    setModalState({
      isOpen: true,
      type,
      title: modalContent[type].title,
      content: modalContent[type].content
    });
  };

  return (
    <>
      <div className={styles.agreementSection}>
        <div className={styles.agreementItem}>
          <input
            type="checkbox"
            id="privacy"
            checked={agreements.privacy}
            onChange={() => onAgreementChange('privacy')}
          />
          <label htmlFor="privacy">(필수) 개인정보 수집 및 이용에 대한 안내</label>
          <Button variant="secondary" onClick={() => openAgreementModal('privacy')} className={styles.viewButton}>
            보기
          </Button>
        </div>

        <div className={styles.agreementItem}>
          <input
            type="checkbox"
            id="marketing"
            checked={agreements.marketing}
            onChange={() => onAgreementChange('marketing')}
          />
          <label htmlFor="marketing">(필수) 마케팅 활용 및 광고성 정보 수신 동의</label>
          <Button variant="secondary" onClick={() => openAgreementModal('marketing')} className={styles.viewButton}>
            보기
          </Button>
        </div>

        <div className={styles.agreementItem}>
          <input type="checkbox" id="terms" checked={agreements.terms} onChange={() => onAgreementChange('terms')} />
          <label htmlFor="terms">(필수) 이용약관</label>
          <Button variant="secondary" onClick={() => openAgreementModal('terms')} className={styles.viewButton}>
            보기
          </Button>
        </div>
      </div>

      {/* 약관 모달 */}
      {modalState.isOpen && (
        <Modal
          title={modalState.title}
          variant="large"
          isOpen={modalState.isOpen}
          onClose={() => setModalState({ ...modalState, isOpen: false })}
          showFooter
          confirmText="확인"
          onConfirm={() => setModalState({ ...modalState, isOpen: false })}
        >
          <div>
            <textarea
              className={inputTxtStyles.textarea}
              value={modalState.content}
              placeholder="내용을 입력하세요."
              disabled
            />
          </div>
        </Modal>
      )}
    </>
  );
};

export default JoinDetail;
