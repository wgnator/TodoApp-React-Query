# ToDoApp
creator: Woongi Han

# Preview

## Login Page
<img width="548" alt="Screen Shot 2022-08-13 at 2 11 53 AM" src="https://user-images.githubusercontent.com/69628701/184409438-9c4edb03-fd54-474b-9514-b7647639b9e9.png">

## Main Page
### 크게보기:
<img width="875" alt="Screen Shot 2022-09-01 at 12 51 19 AM" src="https://user-images.githubusercontent.com/69628701/187722898-847e78e0-192e-4162-b767-10fc17cb5dd5.png">

### 작게보기:
<img width="872" alt="Screen Shot 2022-09-01 at 12 50 43 AM" src="https://user-images.githubusercontent.com/69628701/187722757-76344925-81c1-4036-8e26-ccc59d973d12.png">

## 날짜검색:
<img width="941" alt="Screen Shot 2022-09-02 at 3 47 48 AM" src="https://user-images.githubusercontent.com/69628701/187990078-46a78969-a8cc-4b1d-83c9-fad9d161428b.png">

# 실행방법:

# 1-1) API 실행

```bash
> cd api

> yarn

> yarn start # http://localhost:8080
```

# 1-2) frontend 실행

```bash
> cd frontend

> npm install

> npm run dev
```

# 세부 구현 사항
1. Login / Sign Up
- User Data Fetch: useLogin hook - Axios 로 인스턴스화 된 request를 사용, Axios Interceptor를 이용한 API 측 에러 핸들링
- Login State - Context API 를 이용한 전역 로그인 상태 관리
- Sign Up: generator 함수를 사용하여 비밀번호 재확인 및 회원등록 api 요청 / API에서 반환되는 에러(예: 중복 사용자) 와 app 상의 에러(아이디 형식/비밀번호 재확인 오류)를 모아 한번에 처리 

2. Todo Data Fetch
- useTodoQuery hook - axios 인스턴스에 React Query를 사용한 데이터 request 및 에러 핸들링

3. Sorting / Filtering
- 불러온 할일 목록을 최신 등록/최신 수정 순으로 정렬 및 체크됨 상태에 따른 필터링, 텍스트 검색 필터링, 특정 날짜 또는 기간 선택을 통한 검색(등록/수정날짜 중 정렬 선택한 날짜를 기준)

4. Layout
- 항목들을 크게보기 / 작게보기 선택 가능

