# 첨부파일 처리 구현

## 변경된 파일

### 1. `src/features/notice/script/api.js`

#### 변경 사항

- `create()` 메서드: fileState 파라미터 추가, FormData 방식으로 전송
- `update()` 메서드: fileState 파라미터 추가, FormData 방식으로 전송

#### create 메서드

```javascript
async create(noticeData, fileState) {
  const formData = new FormData();

  // 1. notice 데이터를 JSON Blob으로 추가
  const noticeBlob = new Blob([JSON.stringify(noticeData)], {
    type: 'application/json'
  });
  formData.append('notice', noticeBlob);

  // 2. 파일 메타 정보 (파일이 있을 때만 추가)
  if (fileState && (fileState.new.length > 0 || fileState.existing.length > 0)) {
    const fileMeta = {
      fileId: fileState.fileId,
      deletedIds: fileState.deletedIds || [],
      shouldClearFiles:
        fileState.existing.length > 0 &&
        fileState.deletedIds.length === fileState.existing.length &&
        fileState.new.length === 0
    };
    const fileMetaBlob = new Blob([JSON.stringify(fileMeta)], {
      type: 'application/json'
    });
    formData.append('fileMeta', fileMetaBlob);
  }

  // 3. 신규 파일들
  if (fileState && fileState.new && fileState.new.length > 0) {
    fileState.new.forEach((file) => {
      formData.append('files', file);
    });
  }

  const { data } = await apiClient.post(ADMIN_ENDPOINT, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    _onSuccess: (response) => response.data,
    _onError: (error) => {
      logger.error('공지사항 등록 실패:', error);
      return defaultErrorHandler(error);
    }
  });
  return data;
}
```

#### update 메서드

```javascript
async update(id, noticeData, fileState) {
  const formData = new FormData();

  // 1. notice 데이터를 JSON Blob으로 추가
  const noticeBlob = new Blob([JSON.stringify(noticeData)], {
    type: 'application/json'
  });
  formData.append('notice', noticeBlob);

  // 2. 파일 메타 정보 (파일이 있을 때만 추가)
  if (fileState && (fileState.new.length > 0 || fileState.existing.length > 0)) {
    const fileMeta = {
      fileId: fileState.fileId,
      deletedIds: fileState.deletedIds || [],
      shouldClearFiles:
        fileState.existing.length > 0 &&
        fileState.deletedIds.length === fileState.existing.length &&
        fileState.new.length === 0
    };
    const fileMetaBlob = new Blob([JSON.stringify(fileMeta)], {
      type: 'application/json'
    });
    formData.append('fileMeta', fileMetaBlob);
  }

  // 3. 신규 파일들
  if (fileState && fileState.new && fileState.new.length > 0) {
    fileState.new.forEach((file) => {
      formData.append('files', file);
    });
  }

  const { data } = await apiClient.put(`${ADMIN_ENDPOINT}/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    _onSuccess: (response) => response.data,
    _onError: (error) => {
      logger.error(`공지사항(ID: ${id}) 수정 실패:`, error);
      return defaultErrorHandler(error);
    }
  });
  return data;
}
```

#### FormData 구조

```
FormData {
  notice: Blob(JSON.stringify(noticeData))     // 공지사항 데이터
  fileMeta: Blob(JSON.stringify({              // 파일 메타 정보
    fileId: number | null,                     // 파일 그룹 ID
    deletedIds: number[],                      // 삭제된 파일 ID 목록
    shouldClearFiles: boolean                  // 모든 파일 삭제 여부
  }))
  files: File[]                                // 신규 업로드 파일들
}
```

---

### 2. `src/features/notice/script/entity.js`

#### 변경 사항

- `fileId`, `fileList` 필드 추가
- `Notice.fromApi()` 메서드에서 백엔드 응답 데이터를 프론트엔드 형식으로 변환

#### Notice.fromApi 메서드

```javascript
static fromApi(apiData) {
  if (!apiData) {
    throw new Error('Notice.fromApi: apiData가 필요합니다.');
  }

  return {
    id: apiData.boardId,
    title: apiData.title || '',
    content: apiData.content || '',
    author: apiData.writerName || '알수없음',
    /* 첨부파일 추가 */
    fileId: apiData.fileId,           // 파일 그룹 ID
    fileList: apiData.fileList || [], // 첨부파일 목록
    /* 첨부파일 추가 */
    createdAt: apiData.regDtm || '',
    updatedAt: apiData.updDtm || '',
    isPriority: apiData.priority === 'Y',
    type: apiData.boardTy || 'NOTICE',
    permissions: apiData.permissions || { permissions: [] }
  };
}
```

---

### 3. `src/features/notice/ui/Form.jsx`

#### 변경 사항

- `formData.fileState` 구조 변경: 배열 → 객체 (fileId, existing, new, deletedIds)
- `handleFilesChange` 핸들러 추가
- `FileTr` 컴포넌트에 `fileState`, `onChange` props 연결
- 편집 모드에서 기존 파일 데이터 로드

#### fileState 구조

**변경 전:**

```javascript
const [formData, setFormData] = useState({
  title: '',
  content: '',
  noticeType: 'NOTICE',
  fileState: [] // 배열
});
```

**변경 후:**

```javascript
const [formData, setFormData] = useState({
  title: '',
  content: '',
  noticeType: 'NOTICE',
  fileState: {
    fileId: null, // 파일 그룹 ID
    existing: [], // 기존 파일 목록
    new: [], // 신규 업로드 파일
    deletedIds: [] // 삭제된 파일 ID
  }
});
```

#### 파일 변경 핸들러 추가

```javascript
const handleFilesChange = (newFileState) => {
  setFormData((prev) => ({
    ...prev,
    fileState: newFileState
  }));
};
```

#### 편집 모드 파일 데이터 로드

```javascript
useEffect(() => {
  if (isEditMode && apiData) {
    let noticeType = 'NOTICE';
    if (apiData.boardTy === 'SYSNOTICE') {
      noticeType = 'SYSNOTICE';
    } else if (apiData.priority === 'Y') {
      noticeType = 'IMPORTANT';
    }
    setFormData({
      title: apiData.title || '',
      content: apiData.content || '',
      noticeType: noticeType,
      fileState: {
        fileId: apiData.fileId || null, // 백엔드에서 받은 fileId
        existing: apiData.fileList || [], // 백엔드에서 받은 fileList
        new: [],
        deletedIds: []
      }
    });
  }
}, [isEditMode, apiData]);
```

#### FileTr 컴포넌트 연결

```jsx
<FileTr
  id="notice-files"
  label="파일첨부"
  fileState={formData.fileState} // fileState 전달
  onChange={handleFilesChange} // 변경 핸들러 연결
  multiple={true} // 다중 파일 업로드 허용
  disabled={isEditMode && !canEditOrDelete} // 권한 없으면 비활성화
/>
```

#### API 호출 시 fileState 전달

**등록:**

```javascript
success = await noticeApi.create(payload, formData.fileState);
```

**수정:**

```javascript
success = await noticeApi.update(noticeId, updatePayload, formData.fileState);
```

---

## 파일 처리 흐름

### 1. 파일 업로드 (신규 등록)

1. 사용자가 FileTr 컴포넌트에서 파일 선택
2. `fileState.new` 배열에 File 객체 추가
3. 등록 버튼 클릭 시 `noticeApi.create(payload, fileState)` 호출
4. FormData로 변환하여 백엔드 전송:
   - `notice`: 공지사항 데이터 (JSON Blob)
   - `fileMeta`: 파일 메타 정보 (JSON Blob)
   - `files`: 신규 파일들 (File[])

### 2. 파일 업로드 (수정)

1. 편집 모드 진입 시 기존 파일 정보 로드:
   - `fileId`: 파일 그룹 ID
   - `existing`: 기존 첨부파일 목록
2. 사용자가 파일 추가/삭제:
   - 추가: `fileState.new`에 추가
   - 삭제: `fileState.deletedIds`에 파일 ID 추가
3. 수정 버튼 클릭 시 `noticeApi.update(id, payload, fileState)` 호출
4. FormData로 변환하여 백엔드 전송

### 3. 모든 파일 삭제

- `shouldClearFiles` 플래그로 처리:
  ```javascript
  shouldClearFiles: fileState.existing.length > 0 && // 기존 파일이 있고
    fileState.deletedIds.length === fileState.existing.length && // 모두 삭제되고
    fileState.new.length === 0; // 신규 파일이 없음
  ```

---

---

## 테스트 체크리스트

- [ ] 공지사항 신규 등록 시 파일 업로드
- [ ] 공지사항 수정 시 기존 파일 표시
- [ ] 공지사항 수정 시 파일 추가
- [ ] 공지사항 수정 시 파일 삭제
- [ ] 공지사항 수정 시 모든 파일 삭제
- [ ] 파일 없이 공지사항만 등록/수정
- [ ] 권한 없는 사용자의 파일 수정 차단
- [ ] 다중 파일 업로드 >> 해당하는 경우만
