# API 실행

```bash
> yarn

> yarn start # http://localhost:8080
```

# API 스펙

## [Todos](#todos)

- [getTodos](#getTodos)
- [getTodoById](#getTodoById)
- [createTodo](#createTodo)
- [updateTodo](#updateTodo)
- [deleteTodo](#deleteTodo)

## [Auth](#auth)

- [login](#login)
- [signUp](#signUp)

# <span id="todos">1-3) Todos</span>

## getTodos

### URL

- GET `/todos?userId=asdflSSdfaSDFA`
- Headers
  - Authorization: login token

### 응답 예시

```json
{
  "data": [
    {
      "title": "hi",
      "content": "hello",
      "checked": "true",
      "id": "z3FGrcRL55qDCFnP4KRtn",
      "userId": "asdflSSdfaSDFA",
      "createdAt": "2022-07-24T14:15:55.537Z",
      "updatedAt": "2022-07-24T14:15:55.537Z",
      "refreshToken": ""
    },
    {
      "title": "hi",
      "content": "hello",
      "checked": "false",
      "id": "z3FGrcRL55qDCFnP4KRtn",
      "userId": "asdflSSdfaSDFA",
      "createdAt": "2022-07-24T14:15:55.537Z",
      "updatedAt": "2022-07-24T14:15:55.537Z",
      "refreshToken": ""
    }
  ]
}
```

## getTodoById

### URL

- GET `/todos/:id?userId=asdflSSdfaSDFA`
- Headers
  - Authorization: login token

### 응답 예시

```json
{
  "data": {
    "title": "hi",
    "content": "hello",
    "checked": "false",
    "id": "z3FGrcRL55qDCFnP4KRtn",
    "userId": "asdflSSdfaSDFA",
    "createdAt": "2022-07-24T14:15:55.537Z",
    "updatedAt": "2022-07-24T14:15:55.537Z",
    "refreshToken": ""
  }
}
```

## createTodo

### URL

- POST `/todos?userId=asdflSSdfaSDFA`
- Parameter
  - title: string
  - content: string
- Headers
  - Authorization: login token

### 응답 예시

```json
{
  "data":     {
      "title": "hi",
      "content": "hello",
      "checked": "false",
      "id": "z3FGrcRL55qDCFnP4KRtn",
      "userId": "asdflSSdfaSDFA",
      "createdAt": "2022-07-24T14:15:55.537Z",
      "updatedAt": "2022-07-24T14:15:55.537Z",
      "refreshToken": ""
    }
```

## updateTodo

### URL

- PUT `/todos/:id?userId=asdflSSdfaSDFA`
- Parameter
  - title: string
  - content: string
- Headers
  - Authorization: login token

### 응답 예시

```json
{
  "data": {
    "title": "hi",
    "content": "hello",
    "checked": "false",
    "id": "z3FGrcRL55qDCFnP4KRtn",
    "userId": "asdflSSdfaSDFA",
    "createdAt": "2022-07-24T14:15:55.537Z",
    "updatedAt": "2022-07-24T14:15:55.537Z",
    "refreshToken": ""
  }
}
```

## deleteTodo

### URL

- DELETE `/todos/:id?userId=asdflSSdfaSDFA`
- Headers
  - Authorization: login token

### 응답 예시

```json
{
  "data": null
}
```

# <span id="auth">1-4) Auth</span>

## login

### URL

- POST `/users/login`
- Parameter
  - email: string
  - password: string

### 응답 예시

```json
{
  "message": "성공적으로 로그인 했습니다",
  "userName": "asdf",
  "userId": "asdflSSdfaSDFA",
  "token": "eyJhbGciOiJIUzI1NiJ9.YXNkZkBhc2RmYXNkZi5jb20.h-oLZnV0pCeNKa_AM3ilQzerD2Uj7bKUn1xDft5DzOk"
}
```

## signUp

### URL

- POST `/users/create`
- Parameter
  - email: string
  - password: string

### 응답 예시

```json
{
  "message": "계정이 성공적으로 생성되었습니다",
  "token": "eyJhbGciOiJIUzI1NiJ9.YXNkZkBhc2RmYXNkZi5jb20.h-oLZnV0pCeNKa_AM3ilQzerD2Uj7bKUn1xDft5DzOk"
}
```
