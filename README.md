# airpnp

숙소 예약 서비스 예제입니다. 서버를 먼저 띄우고 화면을 띄웁니다.

영상 편마다 시작 지점과 완성본을 태그로 남겨 두었어요. 따라 하는 방법은 [EPISODES.md](EPISODES.md)를 보세요.

## 서버 (airpnp-server)

Java 25가 필요합니다.

```sh
cd airpnp-server
./gradlew bootRun
```

http://localhost:8080 에서 API가 실행됩니다.

## 화면 (airpnp-web)

Node.js가 필요합니다. 터미널을 하나 더 열어 실행합니다.

```sh
cd airpnp-web
npm install
npm run dev
```

http://localhost:5173 을 브라우저에서 엽니다.
