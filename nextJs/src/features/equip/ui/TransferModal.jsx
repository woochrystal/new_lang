'use client';

import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { equipApi } from '@/features/equip';
import { Modal, Select, Button, Loading } from '@/shared/component';
import { useAlertStore } from '@/shared/store/alertStore';

const TransferModal = ({ isOpen, onClose, onSubmit, currentUserId }) => {
  const { showError } = useAlertStore();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');

  useEffect(() => {
    if (isOpen) {
      const fetchUsers = async () => {
        setLoading(true);
        const result = await equipApi.getTenantUsers();
        if (result && result.data) {
          // 자기 자신을 제외한 사용자 목록
          const filteredUsers = result.data
            .filter((user) => user.usrId !== currentUserId)
            .map((user) => ({ value: user.usrId, label: user.usrNm }));
          setUsers(filteredUsers);
        } else {
          showError('사용자 목록을 불러오는데 실패했습니다.');
        }
        setLoading(false);
      };
      fetchUsers();
    }
  }, [isOpen, currentUserId, showError]);

  const handleSubmit = () => {
    if (!selectedUserId) {
      showError('이관받을 사용자를 선택해주세요.');
      return;
    }
    onSubmit(selectedUserId);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="장비 이관"
      onConfirm={handleSubmit}
      confirmText="이관"
      cancelText="취소"
    >
      {loading ? (
        <Loading message="사용자 목록을 불러오는 중..." />
      ) : (
        <Select
          label="이관받을 사용자"
          options={users}
          value={selectedUserId}
          onChange={setSelectedUserId}
          placeholder="사용자를 선택하세요"
        />
      )}
    </Modal>
  );
};

TransferModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  currentUserId: PropTypes.number
};

export default TransferModal;
