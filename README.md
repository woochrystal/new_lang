# 언어/기술 공부용 리포지토리

**단순 연습용 리포지토리입니다**

## [💻 tailwind.css](https://tailwindcss.com/)
<details>
    <summary>🔎 장단점</summary>

> **장점**
> - 생산성이 높아 작업 속도가 빠름
> - 디자인 일관성 유지
> - 기본 사용 시 클래스명을 따로 고민할 필요 없음


> **단점**
> - 클래스가 많아져 코드 가독성이 떨어질 수 있음
> - 기존 CSS 방식과 구조가 달라 추가 학습 필요
> 

</details>
<details>
    <summary>📖 학습과정</summary> 

> **01. Tailwind 기본**
> - 기본 단위
> - `bg`
> - `rounded`
> - `w`, `h`
> - `p`, `m`
> - 글자 스타일 변경
> - `flex`
> - `hover`
> - `group` 사용법

> **02. React에 Tailwind 적용**
>
> **1) 설치**
> ```bash
> npm install -D tailwindcss postcss autoprefixer
> ```
>
> - **autoprefixer** : CSS 브라우저 prefix 자동 추가
> - **tailwindcss** : Tailwind CSS 라이브러리
> - **PostCSS** : `@tailwind base`, `components`, `utilities` 처리
>
> **2) 생성 파일 확인**
> - `tailwind.config.js`
> - `postcss.config.js`
>
> **3) tailwind.config.js 설정**
> ```js
> content: [
>   "./src/**/*.{html,js,ts,jsx,tsx}",
> ]
> ```
>
> **4) 기본 CSS 추가**
> ```css
> @tailwind base;
> @tailwind components;
> @tailwind utilities;
> ```

> **03. PostCSS 에러 해결**
>
> **1) Tailwind 버전 확인**
> ```bash
> npm ls tailwindcss
> ```
>
> **2) 여러 버전 삭제**
> ```bash
> npm uninstall tailwindcss @tailwindcss/postcss
> ```
>
> **3) 재설치**
> ```bash
> npm install -D tailwindcss@버전 autoprefixer postcss
> ```
>
> **4) 초기화**
> ```bash
> npx tailwindcss init -p
> ```
      
</details>

## [💻 React](https://ko.legacy.reactjs.org/)

<details>
<summary>📖 복습과정</summary> 

> **01. 첫 세팅 react_test**

> **02. Ai CLI 테스트를 위한 기본 리액트 react-board**
> 
> 명령어는 문장형 말고 짧게
> 
> 1)인텔리제이에서 react 게시판 폴더 만들기
> 위치 - 최상위폴더
> ```bash
> npx create-vite@latest 게시판명(ex.react-board)
> React
> JavaScript
>```
> 2)Ollama
> 
> deepseek-coder 버전 실행
> ```bash
> ollama run deepseek-coder
>```
> 3)Aider 실행
> 
> deepseek-coder 버전으로 강제 지정 후 실행
> ```bash
> aider --model ollama/deepseek-coder --edit-format whole .
>```
> 4)react 실행
>
> **02-1. 버전 오류**
> 
> 1)용량 관련
> 
> 용량 부족 응답
> ```bash
> "I'm sorry, but I can't assist with that."
>```
> ollama 용량 확인
> ```bash
> ollama list
>```
> 설치된 모델 size 확인
> ```bash
> ex)
> NAME                     ID              SIZE      MODIFIED       
> deepseek-coder:6.7b      ce298d984115    3.8 GB    16 minutes ago    
> codellama:latest         8fdf8f752f6e    3.8 GB    2 days ago        
> deepseek-coder:latest    3ddd2d3fc8d2    776 MB    2 days ago
>```

> **03. gemini cli 사용 react-board**
> 
> 프론트에서 Aider의 한계를 느끼고 프론트만 gemini cli 사용
> 
> 1)API 키 생성/설정
> 
> - https://aistudio.google.com/app/api-keys
> ```bash
> $env:GEMINI_API_KEY='생성한_키'
> # 설정 확인 (값이 나오는지 확인)
> $env:GEMINI_API_KEY
> ```
> 2)API 패키지 설치
> ````bach
> npm install @google/generative-ai
> ````

> **04. gemini cli 프로젝트, 키 생성**
> 
> 429 에러 뜰 시 api 키 제한사항 있는지 확인
> 
> 프로젝트 새로 생성하는게 빠름
>   1. https://console.cloud.google.com/apis/credentials 프로젝트 선택에서 프로젝트 생성
>   2. 사용자 인증 정보 만들기 > API 키 > 애플리케이션 제한/API 제한 → 없음 설정 후 생성
>   3. https://console.developers.google.com/apis/api/generativelanguage.googleapis.com/overview?project=642777787443 api 사용 누르기
>  ==결국 해결 못함, ollama-llama3 으로 사용
> 
>

</details>

## 💻 Ai CLI
<details>
<summary>🔎 Ai별 특징</summary>

> **01. 기획**
> 
> **1) ChatGPT — 기능 구조 설계**
> - 기획 정리 및 구조화 강점
> - 개발 관련 설명 우수
> - 문서 작성에 적합
>
> **2) Claude — 기획서 정리**
> - 긴 문서 분석에 강함
> - PRD / 기획서 작성 우수
> - 코드 설명 깔끔
>
> **3) Perplexity — 레퍼런스 조사**
> - 검색 기반이라 최신 정보 탐색에 유리
> - 레퍼런스 조사에 적합
>
> ```dash
> 👍 Perplexity (레퍼런스 조사) → ChatGPT (기능 구조 설계) Claude → (기획서 정리)
>```

> **02. 디자인**
>
> **1) Figma AI**
> - UI 자동 생성
> - 개발 협업에 강점
> - 무료 플랜으로도 충분
>
> **2) Galileo AI**
> - 텍스트 → UI 생성
> - 앱 디자인 빠르게 제작
>
> **3) Uizard**
> - 스케치 → UI 변환
> - 기획자 중심 툴
>
> **4) Midjourney**
> - 컨셉 이미지 생성
> - 디자인 레퍼런스 제작
>
> ```dash
> 👍 Midjourney (디자인 컨셉) → Figma (실제 UI 제작)
>```

> **03. 프론트엔드**
>
> **1) Cursor**
> - AI IDE
> - 코드 자동 생성
> - 코드 수정 잘함
>
> **2) GitHub Copilot**
> - 자동완성 최고
> - 코드 생산성 높음
>
> **3) v0.dev**
> - UI → 코드 생성
> - React / Next.js 강함
>
> ```dash
> 👍 v0 (UI 코드 생성) → Cursor (기능 구현)
>```

> **04. 백엔드**
>
> **1) Cursor**
> - 코드 리팩토링
> - 프로젝트 전체 분석
>
> **2) Phind**
> - 개발 질문 답변 최강
> - 스택오버플로우 대체
>
> **3) Sourcegraph Cody**
> - UI → 코드 생성
> - 대규모 코드 분석
>
> ```dash
> 👍 Cursor + Phind
>```

</details>

<details>   
<summary>🤖 Ollama, Aider</summary>

> 
> **01. 사용 장단점**
> 
> | 구분 | 장점 | 단점                |
> |-----|------|-------------------|
> | 비용  | 완전 무료 | GPU 없으면 속도 느림     |
> | 보안 | 로컬 실행이라 코드 외부 전송 없음 | 모델 업데이트 직접 해야 함   |
> | 코드 수정 | 여러 파일 자동 수정 가능 | 모델 성능이 GPT보다 약함   |
> | 자동화 | CLI에서 프로젝트 코드 직접 수정 | 터미널 사용 익숙해야 함     |
> | 컨텍스트 | git 프로젝트 전체 분석 가능 | 큰 프로젝트는 메모리 많이 사용 |
> | 오프라인 | 인터넷 없이 사용 가능 | 모델 다운로드 용량 큼      |

> **02. 각 역할**
> 
>| 도구 | 역할 |
>|-----|------|
>| Ollama  | 로컬에서 AI 모델 실행 |
>| Aider | 프로젝트 코드 읽고 수정 |
> ```text
> Aider → Ollama → 모델 코드 생성 / 수정
> ```


</details>
<details>   
<summary>📖 학습과정</summary>

### 01. Ollama, Aider 이용 세팅 단계
#### 예시 게시판 생성

> **1) Ollama 설치**
> - https://ollama.com/download
>
> 터미널에서 테스트
> ```bash
> ollama run llama3
> ```
> 정상 실행 시
> ```bash
> >>> Send a message
> ```

> **2) 코드용 AI 모델 다운로드(codellama, deepseek-coder)**
>
> ```bash
> ollama pull codellama
> or
> ollama pull deepseek-coder
> ```
> 설치 확인
> ```bash
> ollama run codellama
> or
> ollama run deepseek-coder
> ```

> **3) 코드 수정용 Aider 설치**
>
> `Python` 필요, 버전 확인하고 없으면 설치
> ```bash
> python --version
> pip --version
> ```
> 
> Aider 설치
> ```bash
> pip install aider-chat
> ```
> 설치 확인
> ```bash
> aider --version
> ```

> **4) IntelliJ 세팅**
> 
> ```text
> 파일 → 새 프로젝트 → Spring Boot
> ```
> 설정
> ```text
> Project name : board
> Language : Java
> Build : Gradle
> JDK : 17
> ```
> 의존성 선택
> ```text
> Spring Web
> Spring Data JPA
> H2 Database
> Lombok
> ```
> 폴더 생성(예시)
> ```text
> board
> ├ src
> ├ build.gradle
> └ settings.gradle
> ```

> **5) Aider 실행**
> 
> Ollama 모델 연결
> ```bash
> aider --model ollama/codellama
> ```
> 확인 화면
> ```bash
> Aider vX.X
> Model: ollama/codellama
> Repo-map: using git
> ```


  </details>


## [💻 Vue.js](https://ko.vuejs.org/)
<details>
    <summary>🔎 리액트/자바스크립트와 문법 차이</summary>

> **" @ "**
> 
> 원래 **v-on** 로 사용되는 이벤트 연결 문법
> 
> onClick(react)/addEventListener(javasctipt)등 과 사용 방법 동일
>
> ````example
> @click, @dblclick, @mousedown, @mouseup, @mouseenter, @mouseleave 등
> ````

> **" : "** 
>
> 변수 연결하는 문법
> 
> react에서 {} 사용법과 동일
> ````example
> vue의 <img :src="imageUrl"> = react의 <img src={imageUrl} />
> ````
> 숫자 표현
> ````example
> <MyComp :age="20"> = 숫자 20
> <MyComp age="20"> = 문자 20
> ````

> **" v-model "**
> 
> react에서 useState 사용법과 동일
> ````example
> vue
> <input v-model="text">
> 
> react
> const [text, setText] = useState('')
>
> <input
> value={text}
> onChange={(e) => setText(e.target.value)}
> />

</details>
<details>
    <summary>📖 학습과정</summary> 

> **01. Vue 기본 세팅**

</details>