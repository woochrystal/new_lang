# 언어/기술 학습, 복습용 리포지토리

*단순 연습용 리포지토리입니다* <br>

<br>

## ✍목록
### [tailwind.css 💻](https://tailwindcss.com/)
<details>
    <summary>🔎장단점</summary>

    장점
    1) 생산성이 높아서 작업 속도가 빠르다.
    2) 디자인이 일관적이다.
    3) 클래스명을 고민하지 않아도 된다.(기본형일 경우)

    단점
    1) 코드 가독성이 떨어진다.
    2) 기존 사용하던 CSS와 구조가 달라 별도의 공부가 필요하다.
</details>
<details>
        <summary>📚학습과정</summary> 
    
        01 - tailwind의 기본 단위, bg, rounded, w h p m, 글자변경, flex, hover, group 사용법
        02 - react에 적용하기
            1)  명령어 > npm install -D tailwindcss postcs autoprefixer
                        autoprefixer : CSS를 최적화하고 압축하며 불필요한 공백을 제거
                        tailwindcss : Tailwind 라이브러리
                        PostCSS : @tailwind base;, @tailwind components;, @tailwind utilities;를
                        이해하지 못하기 때문에 React + Tailwind 환경에서 꼭 같이 사용해야 함
            2)  설치 후 tailwind.config.js, postcss.config.js 파일 생성 확인
            3)  tailwind.config.js 안에 컨텐츠 경로 설정
                content: [
                    "./src/**/*.{html,js,ts,jsx,tsx}", // 프로젝트 파일 경로 맞춤
                ],
            4)  기본 css 파일 상단에 @tailwind base;, @tailwind components;, @tailwind utilities; 추가

            --------------------------------------

            PostCSS 에러 계속 뜨면 
            1)  npm ls tailwindcss 로 테일윈드 버전 확인
            2)  여러 버전 있다면 npm uninstall tailwindcss @tailwindcss/postcss 로 삭제
            3)  npm install -D tailwindcss@버전숫자 autoprefixer postcss 로 재설치
            4)  npx tailwindcss init -p 로 테일윈드 초기화

      
</details>


### [React💻](https://ko.legacy.reactjs.org/)

<details>
<summary>📖복습</summary> 

| No. | 내용 |
|-----|------|
| 01  | 첫 세팅 |

</details>

### [Ai CLI text 💻]()
<details>
    <summary>🔎Ai별 특징</summary>


    01 - 기획
    1-1) ChatGPT - 기능 구조 설계
        기획 정리, 구조화 잘함
        개발 관련 설명 강함
        문서 작성 좋음

    1-2) Claude -기획서 정리
        긴 문서 분석 매우 강함
        PRD / 기획서 작성 잘함
        코드 설명 깔끔
    
    1-3) Perplexity - 레퍼런스 조사
        검색 기반이라 최신 정보 찾기 좋음
        레퍼런스 조사할 때 최고


    02 - 디자인 [Midjourney(ex.디자인 컨셉) → Figma(ex.실제 UI 제작)]
    1-1) Figma AI
        UI 자동 생성
        개발 협업 최강
        무료로도 충분

    1-2) Galileo AI
        텍스트 → UI 생성
        앱 디자인 빠르게 만듦

    1-3) Uizard
        스케치 → UI 변환
        기획자용

    1-4) Midjourney
        컨셉 이미지 / 디자인 레퍼런스 생성
        
</details>
<details>   
    <summary>📚학습과정</summary> 
    
    01 - CLI 종류 세팅, 테스트
            
      
  </details>




