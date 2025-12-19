'use client';

import { Loading, Tag } from '@/shared/component';

/**
 * 직원 상세 조회 컴포넌트
 * @param {Object} props
 * @param {Object} props.emp - 직원 데이터
 * @param {boolean} [props.loading=false] - 로딩 상태
 */
const EmpDetail = function (props) {
  const { emp, loading = false } = props;

  if (loading) {
    return <Loading message="직원 정보 로딩 중..." fullscreen={false} />;
  }

  if (!emp) {
    return (
      <div className="flex items-center justify-center p-10 text-gray-500 text-sm">직원 정보를 찾을 수 없습니다.</div>
    );
  }

  // 상태 배지 variant 매핑
  const getStatusVariant = (status) => {
    switch (status) {
      case '승인':
        return 'success';
      case '반려':
        return 'danger';
      case '미결':
        return 'warning';
      default:
        return 'default';
    }
  };

  const detailFields = [
    { label: '사번', value: emp.empNo },
    { label: '이름', value: emp.name },
    { label: '사용자 ID', value: emp.userId },
    { label: '이메일', value: emp.email },
    { label: '부서', value: emp.department },
    { label: '직위', value: emp.position },
    { label: '역할', value: emp.role },
    { label: '연락처', value: emp.phone },
    { label: '주소', value: emp.address || '-' },
    { label: '입사일', value: emp.joinDate },
    {
      label: '근무상태',
      value: (
        <Tag variant={getStatusVariant(emp.workStatus)} size="sm">
          {emp.workStatus}
        </Tag>
      )
    }
  ];

  return (
    <div className="p-6 bg-white rounded-xl border border-gray-200">
      <h2 className="mb-6 text-gray-900 text-xl font-bold">직원 상세 정보</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {detailFields.map((field, index) => (
          <div key={index} className="flex flex-col gap-2">
            <label className="text-gray-600 text-sm font-medium">{field.label}</label>
            <div className="text-gray-900 text-base">{field.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmpDetail;
