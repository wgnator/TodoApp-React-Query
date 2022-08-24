# ToDoApp
creator: Woongi Han

# Preview

### Login Page
<img width="548" alt="Screen Shot 2022-08-13 at 2 11 53 AM" src="https://user-images.githubusercontent.com/69628701/184409438-9c4edb03-fd54-474b-9514-b7647639b9e9.png">

### Main Page
<img width="968" alt="Screen Shot 2022-08-13 at 2 07 34 AM" src="https://user-images.githubusercontent.com/69628701/184408869-cd321659-df79-41a3-9ca7-8fc170919f96.png">

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
useTodoQuery hook - axios 인스턴스에 React Query를 사용한 데이터 request 및 에러 핸들링

3. Sorting / Filtering
불러온 할일 목록을 최신 등록/최신 수정 순으로 정렬 및 체크됨 상태에 따른 필터링, 텍스트 검색 필터링 기능



