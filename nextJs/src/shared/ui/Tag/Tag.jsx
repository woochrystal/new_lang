import styles from '@/shared/ui/Tag/tag.module.scss';

export default function Tag({ variant = 'text', status = 'pending', children, ...rest }) {
  // <Tag  variant="text / tableTxt / square / panel"
  //       status="approve / reject / pending / waiting" /> 형식으로 작성
  // 기본 : text, 미결

  const statusGroup = {
    approve: '승인',
    reject: '반려',
    pending: '결재대기',
    waiting: '대기'
  };

  const label = children || statusGroup[status] || '대기';

  return (
    <div className={`${styles[variant]} ${styles[status]}`} {...rest}>
      {label}
    </div>
  );
}
