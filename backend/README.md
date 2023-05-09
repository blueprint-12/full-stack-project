# full-stack-project-backend

MongoDB, Express, Node.js

## 실행 방법

```bash
yarn && yarn dev
```

## 설치 패키지

date-fns, uuid

> 날짜를 원하는 형태로 파싱해주는 라이브러리 & 고유식별자 생성기(v4: 랜덤값)

```bash
yarn add date-fns uuid
```

cookie-parser

> cookie 헤더를 파싱하고, 쿠키 이름에 의해 키가 지정된 객체로 req.cookies를 채운다.
> secret 문자열을 전달하여 선택적으로 서명된 쿠키 지원을 활성화할 수 있다.
> secret 문자열은 다른 미들웨어에서 사용할 수 있도록 req.secret을 할당한다.

```bash
yarn add cookie-parser
```

cors

> 허용할 도메인을 지정하여 CORS 설정

```bash
yarn add cors
```
