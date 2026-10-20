# airpnp-web (숙소 예약 서비스 화면)

예제 서비스 airpnp의 화면입니다. 서버 API는 [airpnp-server](../airpnp-server/README.md)에 있어요. React와 TypeScript로 만들고, 개발 서버와 빌드는 [Vite](https://vite.dev)를 사용합니다.

## 실행

Node.js가 필요합니다. 서버를 먼저 띄운 뒤 화면을 실행해요.

```sh
npm install
npm run dev
```

http://localhost:5173 에서 열립니다. 화면은 http://localhost:8080 의 서버 API를 호출해요.

서버 주소가 다르면 `VITE_API_URL`로 지정합니다.

```sh
VITE_API_URL=https://api.example.com npm run build
```

## 배포용 빌드

```sh
npm run build
```

타입 검사(`tsc`)를 먼저 하고, `dist` 폴더에 HTML, CSS, JavaScript와 이미지를 만듭니다. 이 폴더를 CDN이나 정적 호스팅에 올리면 돼요.

## 구성

| 파일 | 역할 |
|---|---|
| `index.html`, `src/home.tsx` | 목록 화면. 숙소를 바다 전망, 한옥, 전체 줄로 나눠 보여 줌 |
| `stay.html`, `src/stay.tsx` | 상세 화면과 예약 카드 |
| `host.html`, `src/host.tsx` | 이름, 주소, 1박 가격을 입력해 숙소 등록 |
| `src/Calendar.tsx` | 예약 달력 |
| `src/api.ts` | 서버 주소, 응답 타입, 실패 이유를 알려 주는 요청 함수 |
| `src/format.ts`, `src/layout.tsx` | 금액과 날짜 표시, 헤더와 푸터 |
| `src/style.css` | 스타일 |
| `public/images` | 로고, 숙소 대표 그림 9장과 방 그림 4장 |
| `vite.config.ts` | 목록, 상세, 등록 화면의 빌드 설정 |

2편에서는 오른쪽 위의 숙소 등록 버튼으로 등록 화면에 들어갑니다. `title`, `address`, `pricePerNight`를 JSON으로 전송해요. 성공하면 목록으로 돌아가 새 숙소를 맨 앞에 보여줍니다. 사진은 기본 이미지이며, 서버가 꺼져 있거나 등록이 실패하면 입력을 유지하고 오류를 표시합니다.

예약 달력과 예약 카드는 후속 단원을 위한 화면입니다. 2편에서 동작하는 기능은 숙소 조회와 등록이며, 예약 API는 아직 없습니다. 등록 값은 화면과 서버 양쪽에서 확인합니다.
