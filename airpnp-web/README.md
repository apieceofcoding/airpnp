# airpnp-web (숙소 예약 서비스 화면)

예제 서비스 airpnp의 화면입니다. 서버 API는 [airpnp-server](../airpnp-server/README.md)에 있어요. React 없이 HTML, CSS와 JavaScript로 만들고, 개발 서버와 빌드는 [Vite](https://vite.dev)를 사용합니다.

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

`dist` 폴더에 HTML, CSS, JavaScript와 이미지가 만들어집니다. 이 폴더를 CDN이나 정적 호스팅에 올리면 돼요.

## 구성

| 파일 | 역할 |
|---|---|
| `index.html`, `src/app.js` | 목록 화면. 받아 온 숙소를 바다 전망, 한옥, 전체 줄로 나눠 보여 줌 |
| `stay.html`, `src/stay.js` | 상세 화면, 예약 달력과 예약 카드 |
| `src/api.js` | 서버 API 주소 |
| `src/common.js`, `src/style.css` | 두 화면이 함께 쓰는 금액과 날짜 표시, 스타일 |
| `public/images` | 로고, 숙소 대표 그림 9장과 방 그림 4장 |
| `vite.config.js` | 개발 서버 포트와 두 화면의 빌드 설정 |

화면은 예약된 날짜를 달력에서 막고 겹치면 예약하기 버튼을 끕니다. 서버는 화면을 거치지 않은 요청을 따로 확인하지 않아요. 이 차이는 백엔드 커리큘럼에서 직접 재현합니다.
