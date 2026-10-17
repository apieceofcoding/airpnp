# airpnp-server

airpnp의 스프링 부트 서버입니다. 화면은 [airpnp-web](../airpnp-web/README.md)에 있어요.

## 실행

Java 25가 필요합니다.

```sh
./gradlew bootRun
```

| 주소 | 용도 |
|---|---|
| http://localhost:8080/api/stays | 숙소 목록 API |
| http://localhost:8080/h2-console | DB 조회 (JDBC URL `jdbc:h2:mem:airpnp`, 사용자 `sa`, 비밀번호 없음) |

DB는 메모리에 있어서 서버를 다시 시작하면 비워집니다. 숙소 데이터는 [stays.sql](src/main/resources/sql/stays.sql)을 H2 콘솔에서 실행해 넣어요.
