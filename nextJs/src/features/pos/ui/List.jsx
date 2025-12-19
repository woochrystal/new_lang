import { DataTable, Loading } from '@/shared/component';

import layoutStyles from '@/shared/component/layout/layout.module.scss';

/**
 * 직급 테이블 컴포넌트
 * @param {Object} props
 * @param {Array} props.columns - 컬럼 정의 [{ key, label }]
 * @param {Array} props.data - 테이블 데이터
 * @param {Function} props.onRowClick - 행 클릭 핸들러
 * @param {boolean} [props.loading=false] - 로딩 상태
 * @param {boolean} [props.showActions=true] - 액션 버튼 표시 여부
 */
const PositionTableList = function (props) {
  const { columns, data, onRowClick, loading = false, showActions = true } = props;

  if (loading) {
    return <Loading message="로딩 중..." fullscreen={false} />;
  }

  return (
    <div className={layoutStyles.tableContainer}>
      <DataTable
        columns={columns}
        data={data}
        keyField="id"
        onRowClick={onRowClick ? (row) => onRowClick(row.originalItem) : undefined}
        emptyMessage="직급이 없습니다."
      />
    </div>
  );
};

export default PositionTableList;
