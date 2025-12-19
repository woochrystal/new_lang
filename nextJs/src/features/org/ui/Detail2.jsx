import React, { useEffect, useState } from 'react';
import { DataTable, Loading, Pagination, Button, Select } from '@/shared/component';
import styles from '@/shared/component/layout/layout.module.scss';
import checkStyles from '@/shared/component/input/input.module.scss';
import pageStyles from '../ui/Organization.module.scss';

/**
 * 조직원 목록 컴포넌트
 * @param {Object} props
 * @param {Object|null} props.organization - 선택된 조직 정보
 * @param {Array} props.members - 조직원 목록
 * @param {Object} props.pagination - 페이지 정보 { currentPage, totalPages, pageSize, totalCount }
 * @param {Function} props.onPageChange - 페이지 변경 핸들러
 * @param {Function} props.onBulkMoveDept - 일괄 부서 이동 핸들러
 * @param {Array} props.depth1List - 1Depth 부서 목록
 * @param {Array} props.depth2List - 2Depth 부서 목록
 * @param {Array} props.depth3List - 3Depth 부서 목록
 * @param {boolean} [props.loading=false] - 로딩 상태
 */
const OrganizationMembers = function ({
  organization,
  members = [],
  pagination = null,
  onPageChange,
  onBulkMoveDept,
  depth1List = [],
  depth2List = [],
  depth3List = [],
  loading = false
}) {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedDepth1, setSelectedDepth1] = useState('');
  const [selectedDepth2, setSelectedDepth2] = useState('');
  const [selectedDepth3, setSelectedDepth3] = useState('');
  const [filteredDepth2, setFilteredDepth2] = useState([]);
  const [filteredDepth3, setFilteredDepth3] = useState([]);

  // Depth1 선택 시
  const handleDepth1Change = (value) => {
    setSelectedDepth1(value);
    setSelectedDepth2('');
    setSelectedDepth3('');

    // Depth2 필터링
    const filtered = depth2List.filter((d) => Number(d.uppDeptId) === Number(value));
    setFilteredDepth2(filtered);
    setFilteredDepth3([]);
  };

  // Depth2 선택 시
  const handleDepth2Change = (value) => {
    setSelectedDepth2(value);
    setSelectedDepth3('');

    // Depth3 필터링
    const filtered = depth3List.filter((d) => Number(d.uppDeptId) === Number(value));
    setFilteredDepth3(filtered);
  };

  // 최종 선택된 부서 ID
  const getTargetDeptId = () => {
    if (selectedDepth3) return Number(selectedDepth3);
    if (selectedDepth2) return Number(selectedDepth2);
    if (selectedDepth1) return Number(selectedDepth1);
    return null;
  };

  // 체크박스 전체 선택/해제
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedUsers(members.map((m) => m.usrId));
    } else {
      setSelectedUsers([]);
    }
  };

  // 개별 체크박스 선택/해제
  const handleSelectUser = (usrId, checked) => {
    if (checked) {
      setSelectedUsers((prev) => [...prev, usrId]);
    } else {
      setSelectedUsers((prev) => prev.filter((id) => id !== usrId));
    }
  };

  // 일괄 이동 실행
  const handleMoveClick = () => {
    if (selectedUsers.length === 0) {
      alert('이동할 조직원을 선택해주세요.');
      return;
    }

    const targetDeptId = getTargetDeptId();
    if (!targetDeptId) {
      alert('이동할 부서를 선택해주세요.');
      return;
    }

    onBulkMoveDept && onBulkMoveDept(selectedUsers, targetDeptId);
    setSelectedUsers([]);
    setSelectedDepth1('');
    setSelectedDepth2('');
    setSelectedDepth3('');
    setFilteredDepth2([]);
    setFilteredDepth3([]);
  };

  // 컬럼 정의
  const columns = [
    { key: 'checkbox', label: '선택' },
    { key: 'rowNumber', label: '번호' },
    { key: 'usrNm', label: '이름' },
    { key: 'deptNm', label: '부서' },
    { key: 'posNm', label: '직급' },
    { key: 'usrTel', label: '연락처' },
    { key: 'email', label: '이메일' }
  ];

  // 테이블 데이터 변환
  const tableData = members.map((member, index) => {
    const rowNumber = pagination ? (pagination.currentPage - 1) * pagination.pageSize + index + 1 : index + 1;

    return {
      id: member.usrId,
      rowNumber,
      usrNm: member.usrNm || '-',
      deptNm: member.deptNm || '-',
      posNm: member.posNm || '-',
      usrTel: member.usrTel || '-',
      email: member.email || '-',
      originalItem: member
    };
  });

  // 체크박스 렌더러
  const renderers = {
    checkbox: (value, row) => (
      <input
        type="checkbox"
        checked={selectedUsers.includes(row.id)}
        onChange={(e) => handleSelectUser(row.id, e.target.checked)}
        onClick={(e) => e.stopPropagation()}
      />
    )
  };

  // Select options 생성 헬퍼
  const getDepth1Options = () => {
    return (depth1List || []).map((d) => ({
      value: String(d.deptId),
      label: d.title
    }));
  };

  const getDepth2Options = () => {
    return (filteredDepth2 || []).map((d) => ({
      value: String(d.deptId),
      label: d.title
    }));
  };

  const getDepth3Options = () => {
    return (filteredDepth3 || []).map((d) => ({
      value: String(d.deptId),
      label: d.title
    }));
  };

  // 조직 변경 시 선택 초기화
  useEffect(() => {
    setSelectedUsers([]);
    setSelectedDepth1('');
    setSelectedDepth2('');
    setSelectedDepth3('');
    setFilteredDepth2([]);
    setFilteredDepth3([]);
  }, [organization?.id]);

  return (
    <>
      <div className={`${styles.titleSection} ${styles.titleWithButtonSection}`}>
        <div className={styles.sectionTitle}>
          <h3>조직원 정보</h3>
          {organization && (
            <div className={styles.actionButtonContainer}>
              <Button
                variant="secondary"
                onClick={handleMoveClick}
                disabled={selectedUsers.length === 0 || !getTargetDeptId()}
              >
                부서 이동
              </Button>
            </div>
          )}
        </div>
        {organization && (
          <div className={pageStyles.selectedOrgName}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
              <path d="M256 128C256 110.3 270.3 96 288 96L352 96C369.7 96 384 110.3 384 128L384 192C384 209.7 369.7 224 352 224L344 224L344 288L464 288C503.8 288 536 320.2 536 360L536 416L544 416C561.7 416 576 430.3 576 448L576 512C576 529.7 561.7 544 544 544L480 544C462.3 544 448 529.7 448 512L448 448C448 430.3 462.3 416 480 416L488 416L488 360C488 346.7 477.3 336 464 336L344 336L344 416L352 416C369.7 416 384 430.3 384 448L384 512C384 529.7 369.7 544 352 544L288 544C270.3 544 256 529.7 256 512L256 448C256 430.3 270.3 416 288 416L296 416L296 336L176 336C162.7 336 152 346.7 152 360L152 416L160 416C177.7 416 192 430.3 192 448L192 512C192 529.7 177.7 544 160 544L96 544C78.3 544 64 529.7 64 512L64 448C64 430.3 78.3 416 96 416L104 416L104 360C104 320.2 136.2 288 176 288L296 288L296 224L288 224C270.3 224 256 209.7 256 192L256 128z" />
            </svg>
            <p>{organization.deptNm} 소속</p>
          </div>
        )}
      </div>

      <div className={`${styles.depthSection}`}>
        {loading ? (
          <Loading message="로딩 중..." fullscreen={false} />
        ) : !organization ? (
          <div className={styles.emptyState}>조직을 선택해주세요.</div>
        ) : (
          <>
            {/* 일괄 이동 컨트롤 */}
            <div className={`hasItem03 ${styles.moveControl}`}>
              <Select
                options={getDepth1Options()}
                value={selectedDepth1}
                onChange={handleDepth1Change}
                placeholder="1Depth 선택"
                disabled={selectedUsers.length === 0}
              />
              <Select
                options={getDepth2Options()}
                value={selectedDepth2}
                onChange={handleDepth2Change}
                placeholder="2Depth 선택"
                disabled={!selectedDepth1 || selectedUsers.length === 0}
              />
              <Select
                options={getDepth3Options()}
                value={selectedDepth3}
                onChange={setSelectedDepth3}
                placeholder="3Depth 선택"
                disabled={!selectedDepth2 || selectedUsers.length === 0}
              />
            </div>

            {/* <div className={styles.checkboxControl}>
              <input
                type="checkbox"
                checked={selectedUsers.length === members.length && members.length > 0}
                onChange={(e) => handleSelectAll(e.target.checked)}
              />
              <span>전체 선택 ({selectedUsers.length}명 선택됨)</span>
            </div> */}

            <div className={`${checkStyles.checkWrap} ${pageStyles.checkboxControl}`}>
              <label className={pageStyles.rememberMe}>
                <input
                  type="checkbox"
                  checked={selectedUsers.length === members.length && members.length > 0}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
                <i>
                  <img
                    src={
                      selectedUsers.length === members.length && members.length > 0
                        ? '/check_purple.svg'
                        : '/check_fff.svg'
                    }
                    alt="체크 마크"
                  />
                </i>
                <span>전체 선택 ({selectedUsers.length}명 선택됨)</span>
              </label>
            </div>

            <div className={styles.tableContainer}>
              <DataTable
                columns={columns}
                data={tableData}
                keyField="id"
                renderers={renderers}
                emptyMessage="소속 조직원이 없습니다."
              />
            </div>

            {pagination && pagination.totalPages > 1 && (
              <div className={styles.pagination}>
                <Pagination
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  onPageChange={onPageChange}
                  pageSize={pagination.pageSize}
                />
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default OrganizationMembers;
