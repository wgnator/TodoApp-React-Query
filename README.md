# ToDoApp
creator: Woongi Han

# Preview

## Login Page
<img width="548" alt="Screen Shot 2022-08-13 at 2 11 53 AM" src="https://user-images.githubusercontent.com/69628701/184409438-9c4edb03-fd54-474b-9514-b7647639b9e9.png">

## Main Page

### 작게보기:
<img width="952" alt="Screen Shot 2022-09-03 at 7 21 57 PM" src="https://user-images.githubusercontent.com/69628701/188266335-ddd789af-0971-42cb-983b-621ec9ec074a.png">

### 크게보기:
<img width="954" alt="Screen Shot 2022-09-03 at 7 22 13 PM" src="https://user-images.githubusercontent.com/69628701/188266336-b0800414-7d94-4557-9c02-506923c93b7f.png">

## 날짜검색:
<img width="952" alt="Screen Shot 2022-09-03 at 7 27 34 PM" src="https://user-images.githubusercontent.com/69628701/188266462-d697c9d3-cf02-46d7-a977-1563cd7d99cb.png">

## 반응형 - 모바일:
<img width="284" alt="Screen Shot 2022-09-03 at 7 02 11 PM" src="https://user-images.githubusercontent.com/69628701/188266264-4462970d-0d78-4196-bca6-d2552b1025ef.png">
<img width="286" alt="Screen Shot 2022-09-03 at 7 03 14 PM" src="https://user-images.githubusercontent.com/69628701/188266262-0bff37be-8e8d-4cc3-a6dc-dcb03e2e7a06.png">
<img width="284" alt="Screen Shot 2022-09-03 at 7 17 27 PM" src="https://user-images.githubusercontent.com/69628701/188266259-6d6671f2-2044-4d7c-8a3d-571b8e2e8927.png">


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

