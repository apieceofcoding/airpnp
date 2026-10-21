# airpnp-server

airpnp의 스프링 부트 서버입니다. 화면은 [airpnp-web](../airpnp-web/README.md)에 있어요.

## 3편 패키지

- `web`: StayController, StayRequest, StayResponse, WebConfig.
- `domain`: Stay, StayRepository.
- AirpnpApplication은 상위 패키지에 두어 하위 컴포넌트를 탐색합니다.

1편과 2편은 기존 패키지 구조를 유지해요.

## 실행

Java 25가 필요합니다.

```sh
./gradlew bootRun
```

| 주소 | 용도 |
|---|---|
| http://localhost:8080/api/stays | 숙소 목록 API |
| POST http://localhost:8080/api/stays | 이름, 주소, 1박 가격으로 숙소 등록 |
| http://localhost:8080/api/stays/{id} | 숙소 상세 API |
| http://localhost:8080/h2-console | DB 조회 (JDBC URL `jdbc:h2:mem:airpnp`, 사용자 `sa`, 비밀번호 없음) |

2편부터 application.yaml 설정으로 테이블 생성 후 숙소 9개를 자동 입력합니다. H2는 메모리 DB라 서버를 재시작하면 추가한 숙소도 초기화돼요.

등록 요청 예시입니다. id와 기본 이미지는 서버가 정합니다.

```sh
curl -i http://localhost:8080/api/stays \
  -H 'Content-Type: application/json' \
  -d '{"title":"바다 앞 숙소","address":"강릉시","pricePerNight":148000}'
```

성공하면 HTTP 201과 저장된 숙소 JSON을 반환합니다. 이름과 주소는 필수이고 가격은 1원부터 1억 원 사이의 정수예요. 인증과 권한은 아직 없는 로컬 학습 예제이므로 외부에 공개 배포하지 않습니다.
