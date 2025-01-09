# Gabdong's Develop Blog

```bash
├── client
│   ├── components
│   ├── lib
│   ├── public
│   ├── styles
│   └── pages
└── server
    ├── dist
    └── src
         ├── @types
         ├── lib
         └── server.ts
```

### 클라이언트 사이드
- **`components/`**: 재사용 가능한 UI 컴포넌트
- **`lib/`**: 클라이언트에서 사용하는 유틸리티 함수 및 API 호출 함수
- **`public/`**: 이미지, 아이콘, 폰트 등과 같은 정적 파일
- **`styles/`**: 프로젝트의 글로벌 스타일 파일
- **`pages/`**: 페이지 디렉토리

### 서버 사이드
- **`dist/`**: TypeScript로 작성된 서버 코드를 컴파일한 후의 JavaScript 파일
- **`src/`**: TypeScript 소스 코드가 위치
  - **`@types/`**: 서버에서 사용하는 타입 정의 파일
  - **`lib/`**: 서버에서 사용되는 유틸리티 함수, DB/AWS config, middleware, API
  - **`server.ts`**: 미들웨어, 라우팅 등을 정의
