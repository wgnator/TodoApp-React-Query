# ToDoApp
creator: Woongi Han

deployed site: https://nator-todoapp.netlify.app/ (id: qwer@qwer.com /pw: asdfasdf)

# Preview

## Login Page
<img width="548" alt="Screen Shot 2022-08-13 at 2 11 53 AM" src="https://user-images.githubusercontent.com/69628701/184409438-9c4edb03-fd54-474b-9514-b7647639b9e9.png">

## Main Page

### 작게보기:
<img width="952" alt="Screen Shot 2022-09-03 at 7 21 57 PM" src="https://user-images.githubusercontent.com/69628701/188266335-ddd789af-0971-42cb-983b-621ec9ec074a.png">

### 크게보기:
<img width="954" alt="Screen Shot 2022-09-03 at 7 22 13 PM" src="https://user-images.githubusercontent.com/69628701/188266336-b0800414-7d94-4557-9c02-506923c93b7f.png">

![ToDoApp__view_mode (1)](https://user-images.githubusercontent.com/69628701/188488924-bf3bdba3-5cfb-45f0-8d81-892280ef5e69.gif)

## 정렬 및 검색

### 정렬
![ToDoApp__sort_options_date_type](https://user-images.githubusercontent.com/69628701/188488989-24dd5992-5d81-4432-8770-9aa9df772c4f.gif)

### 텍스트 검색
![ToDoApp__sort_options (1)](https://user-images.githubusercontent.com/69628701/188489190-7bfb8d9c-f234-452a-935a-80b355d098ef.gif)

### 날짜검색
<img width="952" alt="Screen Shot 2022-09-03 at 7 27 34 PM" src="https://user-images.githubusercontent.com/69628701/188266462-d697c9d3-cf02-46d7-a977-1563cd7d99cb.png">

![ToDoApp__date_selection](https://user-images.githubusercontent.com/69628701/188490247-8a52d237-e7af-4c1d-bc83-ac2555374c6e.gif)

### 체크검색
![ToDoApp__sort_options](https://user-images.githubusercontent.com/69628701/188489507-f8928952-b297-4be6-bdd8-f21c935b9319.gif)

## 반응형 - 모바일:
<img width="284" alt="Screen Shot 2022-09-03 at 7 02 11 PM" src="https://user-images.githubusercontent.com/69628701/188266264-4462970d-0d78-4196-bca6-d2552b1025ef.png">

<img width="286" alt="Screen Shot 2022-09-03 at 7 03 14 PM" src="https://user-images.githubusercontent.com/69628701/188266262-0bff37be-8e8d-4cc3-a6dc-dcb03e2e7a06.png">

<img width="284" alt="Screen Shot 2022-09-03 at 7 17 27 PM" src="https://user-images.githubusercontent.com/69628701/188266259-6d6671f2-2044-4d7c-8a3d-571b8e2e8927.png">

https://youtu.be/iJ8VVzAbKL4

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
## API
- [원본 리포지토리](github.com/starkoora/wanted-pre-onboarding-challenge-fe-1-api) 에서 가져와 Pagination, JWT authentication 등을 추가 구현하였음.

## Frontend
1. Login / Sign Up
- Login: JWT Authentication 구현
  - 로그인 또는 회원가입 시 Access Token 과 Refresh Token 발행. 새로운 Refresh Token은 API 측에서 사용자 데이터와 함께 보관하며, http-only cookie 로 응답 / Access Token 은 frontend 측에서 AuthContext 에 저장.
  - Refresh Token: "로그인 상태 유지" 옵션 체크의 경우 만료 날짜는 영원히 / 체크되지 않은 경우 1일이나, 만료되기 23시간 전에 접속한 경우 계속 refresh 됨.
  - Access Token: 1분마다 만료 됨. 만료되어 403 Forbidden 에러를 받을 경우 Axios Interceptor는 새로운 토큰 발행을 요청, 성공할 시 실패한 이전 요청을 재요청.
- Sign Up: 비밀번호 재확인 및 회원 등록 api 요청 / API에서 반환되는 에러(예: 중복 사용자) 와 app 상의 에러(아이디 형식/비밀번호 재확인 오류)를 모아 한번에 처리 

2. Data Fetch
- useTodoQuery hook - axios 인스턴스에 React Query를 사용하여 페이지네이션된 데이터 펫칭 및 에러 핸들링

3. Todos Layout
- 항목들을 접어보기 / 펼쳐보기 선택 가능
- 항목들의 기간에 따른 분류(오늘/이번주/이번달/이전) 및 여닫을 수 있게 구현
- Infinite Scroll 적용

4. Sorting / Filtering
- 불러온 할일 목록을 최신 등록/최신 수정 순으로 정렬 
- 텍스트 검색 필터링 (Debouncer 적용)
- 특정 날짜 또는 기간 선택을 통한 검색(등록/수정날짜 중 정렬 선택한 날짜를 기준)
- 체크됨 상태에 따른 필터링 

5. 반응형
- 모바일 사이즈의 경우 검색옵션을 숨겨지는 것이 default 이며 클릭으로 열고 닫을 수 있게 구현
- 텍스트 검색 시 입력창 크기 증가

