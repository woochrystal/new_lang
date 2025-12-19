/**
 * @fileoverview 내정보 관련 상수
 */

export const FIELD_LABELS = {
  // 기본 정보
  name: '이름',
  englishName: '영어 이름',
  phone: '연락처',

  // 조직 정보
  department: '부서',
  position: '직급',
  email: '이메일',

  // 계정 정보
  id: 'ID',
  role: '회원권한',

  // 인사 정보
  birthDate: '생년월일',
  company: '소속회사',
  career: '경력',

  // 연락처 정보
  address: '주소',
  internalPhone: '사내 연락처',
  extension: '내선번호',

  // 재직 정보
  joinDate: '입사일',
  leaveDate: '퇴사일',
  note: '비고'
};

export const EDUCATION_LEVELS = [
  { value: 'HIGH_SCHOOL', label: '고졸' },
  { value: 'ASSOCIATE', label: '전문학사' },
  { value: 'BACHELOR', label: '학사' },
  { value: 'MASTER', label: '석사' },
  { value: 'DOCTORATE', label: '박사' }
];

export const FILE_TYPES = {
  EDUCATION: 'education', // 학력/교육 증빙 파일 (백엔드: education-file)
  CERTIFICATION: 'certification', // 자격증명 증빙 파일 (백엔드: certification-file)
  CAREER: 'career' // 경력증명 증빙 파일 (백엔드: career-file)
};

export const FILE_LABELS = {
  [FILE_TYPES.EDUCATION]: '프로필 파일 업로드',
  [FILE_TYPES.CERTIFICATION]: '자격증빙 파일 업로드',
  [FILE_TYPES.CAREER]: '경력증빙 파일 업로드'
};
