# 언어/기술 학습, 복습용 리포지토리

*단순 연습용 리포지토리입니다* <br>

<br>

## ✍목록
### [tailwind.css 💻](https://tailwindcss.com/)
> #### 장점
> - 생산성이 높아서 작업 속도가 빠르다.
> - 디자인이 일관적이다.
> - 클래스명을 고민하지 않아도 된다.(기본형일 경우)
>
> #### 단점
> - 코드 가독성이 떨어진다.
> - 기존 사용하던 CSS와 구조가 달라 별도의 공부가 필요하다.
>
  <details>
      <summary>📖학습과정</summary> 
    
      01 -  tailwind의 기본 단위, bg, rounded, w h p m, 글자변경, flex, hover, group 사용법
      02 -  react에 적용하기
            1)  명령어 > npm install -D tailwindcss postcs autoprefixer
                autoprefixer : CSS를 최적화하고 압축하며 불필요한 공백을 제거
                tailwindcss : Tailwind 라이브러리
                PostCSS : @tailwind base;, @tailwind components;, @tailwind utilities;
                를 이해하지 못하기 때문에 React + Tailwind 환경에서 꼭 같이 사용해야 함
            2)  설치 후 tailwind.config.js, postcss.config.js 파일 생성 확인
            3)  tailwind.config.js 안에 컨텐츠 경로 설정
                content: [
                  "./src/**/*.{html,js,ts,jsx,tsx}", // 프로젝트 파일 경로 맞춤
                ],
            4)  기본 css 파일 상단에 @tailwind base;, @tailwind components;, @tailwind utilities; 추가

            .

            PostCSS 에러 계속 뜨면 
            1)  npm ls tailwindcss 로 테일윈드 버전 확인
            2)  여러 버전 있다면 npm uninstall tailwindcss @tailwindcss/postcss 로 삭제
            3)  npm install -D tailwindcss@버전숫자 autoprefixer postcss 로 재설치
            4)  npx tailwindcss init -p 로 테일윈드 초기화

      
  </details>


### [React💻](https://ko.legacy.reactjs.org/)
  <details>
      <summary>📖복습</summary> 
    
      01 - 첫 세팅
      
  </details>





