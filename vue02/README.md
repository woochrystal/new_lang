# Vue.js 컴포넌트 분리 공부용 프로젝트

Vue 3 + Vite 기준으로 컴포넌트를 역할별로 나눈 예제입니다.

## 폴더 구조
- `src/components/common` : 여러 화면에서 재사용하는 공통 UI
- `src/components/layout` : Header / Footer 같은 레이아웃
- `src/components/product` : 상품 도메인 컴포넌트
- `src/views` : 실제 페이지 단위
- `src/data` : 화면에서 사용할 예제 데이터

## 공부 순서
1. `App.vue`에서 `HomeView`가 어떻게 연결되는지 확인
2. `HomeView.vue`에서 작은 컴포넌트를 조합하는 방식 확인
3. `ProductList.vue`에서 `v-for`로 `ProductCard.vue`를 반복 렌더링
4. `ProductCard.vue`의 `props` 확인
5. `SearchBar.vue`의 `emit`으로 부모에게 값을 전달하는 방식 확인
6. `ProductList.vue`의 `computed`와 검색 필터 확인

## 실행
npm install
npm run dev
