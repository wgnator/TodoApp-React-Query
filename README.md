# ToDoApp
creator: Woongi Han

# Preview

## Login Page
<img width="548" alt="Screen Shot 2022-08-13 at 2 11 53 AM" src="https://user-images.githubusercontent.com/69628701/184409438-9c4edb03-fd54-474b-9514-b7647639b9e9.png">

## Main Page
### 크게보기:
<img width="847" alt="Screen Shot 2022-08-31 at 6 16 14 PM" src="https://user-images.githubusercontent.com/69628701/187644116-af502b15-e61f-4c1a-8689-424d6e6e8788.png">

### 작게보기:
<img width="848" alt="Screen Shot 2022-08-31 at 6 16 34 PM" src="https://user-images.githubusercontent.com/69628701/187644177-c721d26c-7e13-41ef-9f4c-88c4ed2ccfac.png">

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
- 불러온 할일 목록을 최신 등록/최신 수정 순으로 정렬 및 체크됨 상태에 따른 필터링, 텍스트 검색 필터링 기능



