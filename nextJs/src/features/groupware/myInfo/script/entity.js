/**
 * UserInfo entity class
 * - Keeps user profile fields for MyInfo feature.
 * - Address is managed as roadAddress + addressDetail; server receives addr as "road|detail".
 */
export class UserInfo {
  constructor(data = {}) {
    // Basic info
    this.name = data.name || '';
    this.englishName = data.englishName || '';
    this.phone = data.phone || '';

    // Organization
    this.department = data.department || ''; // deptId (String)
    this.departmentName = data.departmentName || ''; // 부서명 (표시용)
    this.position = data.position || ''; // posId (String)
    this.positionName = data.positionName || ''; // 직급명 (표시용)
    this.email = data.email || '';

    // Account
    this.id = data.id || '';
    this.role = data.role || '';

    // Personal
    this.birthDate = data.birthDate || '';
    this.company = data.company || '';
    this.emergencyContact = data.emergencyContact || ''; // 비상연락처 (USR_EMG_TEL)
    this.education = data.education || ''; // 학력 (EDU_LVL)

    // Contact
    this.address = data.address || '';
    this.roadAddress = data.roadAddress || '';
    this.addressDetail = data.addressDetail || '';
    this.extension = data.extension || '';

    // Employment
    this.joinDate = data.joinDate || '';
    this.leaveDate = data.leaveDate || '';
    this.note = data.note || '';

    // Files - fileState 구조 ({ saved, new, deleted })
    this.educationFile = data.educationFile || { saved: null, new: null, deleted: false };
    this.certificationFile = data.certificationFile || { saved: null, new: null, deleted: false };
    this.careerFile = data.careerFile || { saved: null, new: null, deleted: false };

    // Profile image - fileState 구조
    this.profileImage = data.profileImage || { saved: null, new: null, deleted: false };
  }

  /**
   * Map API response to UserInfo instance
   */
  static fromApi(apiData = {}) {
    // null 또는 undefined 체크
    if (!apiData || typeof apiData !== 'object') {
      return new UserInfo();
    }

    // 파일 상태 생성 헬퍼 함수 (sys/emp와 동일)
    const createFileState = (fileDtlId, orgFileNm) => {
      if (!fileDtlId) {
        return { saved: null, new: null, deleted: false };
      }

      return {
        saved: {
          fileDtlId,
          fileName: orgFileNm || '',
          orgFileNm: orgFileNm || '',
          fileUrl: `/api/common/files/view/${fileDtlId}`
        },
        new: null,
        deleted: false
      };
    };

    const rawAddr = apiData.addr || '';
    let roadAddress = '';
    let addressDetail = '';
    if (typeof rawAddr === 'string' && rawAddr.includes('|')) {
      const [r, d] = rawAddr.split('|');
      roadAddress = r || '';
      addressDetail = d || '';
    } else {
      roadAddress = rawAddr || '';
      addressDetail = '';
    }

    const department = apiData.deptId ? String(apiData.deptId) : '';
    const position = apiData.posId ? String(apiData.posId) : '';

    return new UserInfo({
      // Basic
      name: apiData.usrName || '',
      englishName: apiData.usrNameEn || '',
      phone: apiData.usrTel || '',

      // Organization
      department,
      departmentName: apiData.deptName || '',
      position,
      positionName: apiData.positionName || '',
      email: apiData.email || '',

      // Account
      id: apiData.loginId || '',
      role: apiData.usrAuth || '',

      // Personal
      birthDate: apiData.birthDate || '',
      company: apiData.tenantName || '',
      emergencyContact: apiData.usrEmgTel || '',
      education: apiData.eduLvl || '',

      // Contact
      address: [roadAddress, addressDetail].filter(Boolean).join(' '),
      roadAddress,
      addressDetail,
      extension: apiData.tenantTel || '',

      // Employment
      joinDate: apiData.joinDate || '',
      leaveDate: apiData.quitDate || '',
      note: apiData.note || '',

      // Files - fileState 구조로 변환 (sys/emp와 동일)
      educationFile: createFileState(apiData.usrProFileDtlId, apiData.usrProOrgFileNm),
      certificationFile: createFileState(apiData.usrCertFileDtlId, apiData.usrCertOrgFileNm),
      careerFile: createFileState(apiData.usrRefFileDtlId, apiData.usrRefOrgFileNm),

      // Profile image - fileState 구조로 변환 (sys/emp와 동일)
      profileImage: createFileState(apiData.usrPicFileDtlId, apiData.usrPicOrgFileNm)
    });
  }

  /**
   * Convert to FormData (emp 방식)
   */
  toFormData() {
    const formData = new FormData();

    // 주소 조합
    let composedAddr = '';
    if (this.roadAddress && this.roadAddress.trim() !== '') {
      composedAddr =
        this.addressDetail && this.addressDetail.trim() !== ''
          ? `${this.roadAddress}|${this.addressDetail}`
          : this.roadAddress;
    }

    // department와 position을 Number로 변환
    const deptId = this.department && this.department !== '' ? Number(this.department) : null;
    const posId = this.position && this.position !== '' ? Number(this.position) : null;

    // JSON 데이터 생성
    const userData = {
      usrName: this.name,
      usrNameEn: this.englishName,
      usrTel: this.phone,
      email: this.email,
      deptId,
      posId,
      eduLvl: this.education,
      birthDate: this.birthDate,
      addr: composedAddr,
      usrEmgTel: this.emergencyContact,
      joinDate: this.joinDate || null,
      quitDate: this.leaveDate || null,
      note: this.note
    };

    // JSON을 Blob으로 추가 (emp 방식)
    formData.append('userData', new Blob([JSON.stringify(userData)], { type: 'application/json' }));

    // 새 파일 추가 (new 파일만) - 백엔드 필드명과 일치
    if (this.profileImage.new) {
      formData.append('usrPicFile', this.profileImage.new);
    }
    if (this.educationFile.new) {
      formData.append('usrProFile', this.educationFile.new);
    }
    if (this.certificationFile.new) {
      formData.append('usrCertFile', this.certificationFile.new);
    }
    if (this.careerFile.new) {
      formData.append('usrRefFile', this.careerFile.new);
    }

    // 삭제할 파일 목록 추가 (배열로 전송)
    const deletedFiles = [];

    // 명시적 삭제 또는 파일 교체
    if ((this.profileImage.deleted && this.profileImage.saved) || (this.profileImage.saved && this.profileImage.new)) {
      deletedFiles.push('usrPicFile');
    }
    if (
      (this.educationFile.deleted && this.educationFile.saved) ||
      (this.educationFile.saved && this.educationFile.new)
    ) {
      deletedFiles.push('usrProFile');
    }
    if (
      (this.certificationFile.deleted && this.certificationFile.saved) ||
      (this.certificationFile.saved && this.certificationFile.new)
    ) {
      deletedFiles.push('usrCertFile');
    }
    if ((this.careerFile.deleted && this.careerFile.saved) || (this.careerFile.saved && this.careerFile.new)) {
      deletedFiles.push('usrRefFile');
    }

    // deletedFiles를 JSON Blob으로 추가 (emp 방식과 동일)
    if (deletedFiles.length > 0) {
      formData.append('deletedFiles', new Blob([JSON.stringify(deletedFiles)], { type: 'application/json' }));
    }

    return formData;
  }

  /**
   * Clone with overrides
   */
  copyWith(newValues = {}) {
    return new UserInfo({ ...this, ...newValues });
  }
}
