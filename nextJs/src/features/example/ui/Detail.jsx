'use client';

import { useRouter } from 'next/navigation';

import { Button, RenderGuard } from '@/shared/component';
import { useApi } from '@/shared/hooks';
import { api } from '../script/api';
import { formatDate } from '../script/utils';
import { Board } from '../script/entity';
import { createDynamicPath } from '@/shared/lib';
import { useAlertStore } from '@/shared/store';
import { FileInput } from '@/features/aprv';

// import styles from './Example.module.scss';

//공통디자인 scss
import styles from '@/shared/component/layout/layout.module.scss';

//특정 스타일 추가 할 경우에만 별도 scss 파일 추가해서 수정해주세요
import exampleStyles from './Example.module.scss';

/**
 * 게시글 상세 컴포넌트
 * @param {Object} props
 * @param {number} props.boardId - 게시글 ID
 * @param {Function} props.onBack - 뒤로가기 콜백
 * @param {Function} props.onDelete - 삭제 후 콜백
 * @param {boolean} [props.showActions=true] - 액션 버튼 표시 여부
 */
const BoardDetail = function (props) {
  const { boardId, onBack, onDelete } = props;

  const router = useRouter();

  // 더미데이터용
  // const paragraph =`찰스 스트릭랜드는 평범한 삶을 살던 중 어느 날, 자신이 정말로 원하는 삶이 무엇인지 깨닫는다.
  //                 그는 안정적인 직장과 가족, 사회적 인정 같은 모든 것을 버리고, 단지 화가가 되고 싶다는 욕망 하나만을 따라 길을 나선다.
  //                 사람들은 그를 미쳤다고 생각했지만, 스트릭랜드는 흔들리지 않았다.

  //                 파리의 좁은 골목길과 햇살 가득한 스튜디오에서 그는 붓을 들고 세상의 아름다움과 자신만의 내면을 캔버스에 옮기기 시작한다.
  //                 그 과정에서 그는 수많은 고난과 빈곤, 배척을 겪지만, 자신의 예술적 열정을 포기하지 않는다.
  //                 그리고 마침내, 그의 작품은 살아 있는 감정과 생명의 울림으로 가득 차 사람들의 마음을 흔든다.

  //                 스트릭랜드의 이야기는 우리에게 묻는다.
  //                 과연 진정한 행복은 안정과 타인의 인정에서 오는가, 아니면 스스로 선택한 길 위에서 발견하는가.
  //                 그는 말없이, 그러나 강렬하게, 삶과 예술의 본질을 우리에게 보여준다.`;

  // useApi로 상세 조회
  const { data: apiData, has, isLoading } = useApi(() => api.get(boardId), [boardId]);

  const boardData = apiData ? Board.fromApi(apiData) : null;

  const handleDelete = async function () {
    const success = await api.delete(boardId);

    if (success) {
      if (onDelete) {
        onDelete();
      } else if (onBack) {
        onBack();
      } else {
        router.push(createDynamicPath('/example'));
      }
    }
  };

  // 이벤트 핸들러
  const handleBack = function () {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  const handleEdit = function () {
    router.push(createDynamicPath(`/example/edit?id=${boardId}`));
  };

  const confirmDelete = function () {
    const { showConfirm } = useAlertStore.getState();
    showConfirm({
      title: '게시글 삭제',
      message: `"${boardData?.title || '이 게시글'}"을 정말로 삭제하시겠습니까?`,
      onConfirm: function () {
        handleDelete();
      },
      variant: 'warning',
      confirmText: '삭제',
      cancelText: '취소'
    });
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}>로딩 중...</div>
      </div>
    );
  }

  if (!boardData) {
    return (
      <div className={styles.errorContainer}>
        <h2>게시글을 찾을 수 없습니다</h2>
        <p>요청하신 게시글이 존재하지 않거나 삭제되었습니다.</p>
        <Button variant="primary" onClick={handleBack}>
          목록으로 돌아가기
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.boardDetail}>
      {/* <div className={styles.header}>
        <div className={styles.navigation}>
          <Button variant="basic" onClick={handleBack} className={styles.backButton}>
            ← 목록으로
          </Button>
        </div>

        <RenderGuard check={() => has('edit')}>
          <div className={styles.actions}>
            <Button variant="secondary" onClick={handleEdit}>
              수정
            </Button>
            <RenderGuard check={() => has('delete')}>
              <Button variant="secondary" onClick={confirmDelete} className={styles.buttonDanger}>
                삭제
              </Button>
            </RenderGuard>
          </div>
        </RenderGuard>
      </div> */}

      <div className={styles.titleSection}>
        <h2 className={styles.title}>{boardData.title}</h2>

        {/* 더미데이터용 */}
        {/* <h2 className={styles.title}>제목예시</h2> */}

        <div className={styles.meta}>
          <div className={styles.metaItem}>
            <span className={styles.label}>작성일:</span>
            <span className={styles.value}>{formatDate(boardData.createdAt)}</span>
          </div>
          {boardData.updatedAt !== boardData.createdAt && (
            <div className={styles.metaItem}>
              <span className={styles.label}>수정일:</span>
              <span className={styles.value}>{formatDate(boardData.updatedAt)}</span>
            </div>
          )}
        </div>

        {boardData.tags && boardData.tags.length > 0 && (
          <div className={styles.tags}>
            {boardData.tags.map((tag, index) => (
              <span key={index} className={styles.tag}>
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className={styles.content}>
        <div className={styles.contentBody}>
          {boardData.content.split('\n').map((paragraph, index) =>
            paragraph.trim() ? (
              <p key={index} className={styles.paragraph}>
                {paragraph}
              </p>
            ) : (
              <br key={index} />
            )
          )}

          {/* 더미데이터용 */}
          {/* {paragraph.split('\n').map((line, idx) =>
            line.trim() ? (
              <p key={idx} className={styles.paragraph}>
                {line}
              </p>
            ) : (
              <br key={idx} />
            )
          )} */}
        </div>
      </div>
      <FileInput
        label={'첨부파일'}
        fileState={{
          existing: [],
          new: [],
          deletedIds: []
        }}
        onChange={() => {}}
        multiple={true}
        disabled={true}
        accept="*"
        placeholder="첨부파일"
      />

      <div className={styles.bottomActions}>
        <Button variant="secondary" onClick={handleBack} className={styles.buttonLarge}>
          목록으로
        </Button>
      </div>
    </div>
  );
};

export default BoardDetail;
