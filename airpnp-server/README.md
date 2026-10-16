# airpnp-server (숙소 예약 서비스 API)

[백엔드 커리큘럼](../../curriculum.md)에서 함께 개선하는 예제 서비스 airpnp의 서버입니다. 화면은 [airpnp-web](../airpnp-web/README.md)에 따로 있어요. 에어비앤비처럼 숙소 목록을 보고, 날짜와 인원을 골라 예약할 수 있습니다.

겉모습은 실제 서비스처럼 만들고, 서버는 일부러 작고 부족하게 시작합니다. 빠진 부분은 뒤 편에서 직접 재현하고 고쳐요.

## 실행

Java 25가 필요합니다. DB는 앱 안에서 함께 실행되므로 따로 설치하지 않아요.

```sh
./gradlew bootRun
```

Windows에서는 `.\gradlew.bat bootRun`을 사용합니다. 화면을 보려면 [airpnp-web](../airpnp-web/README.md)도 함께 실행해요.

| 주소 | 용도 |
|---|---|
| http://localhost:5173 | 화면 (airpnp-web) |
| http://localhost:8080/api/stays | 서버 API |
| http://localhost:8080/h2-console | DB 조회 화면 |

DB 조회 화면에는 JDBC URL `jdbc:h2:mem:airpnp`, 사용자 `sa`, 빈 비밀번호로 접속합니다.

```sql
SELECT * FROM stays;
SELECT * FROM bookings;
```

실행한 SQL은 터미널 로그에도 출력돼요.

## 구성

| 파일 | 역할 |
|---|---|
| `StayController` | 목록, 상세, 예약과 예약 내역 API |
| `Stay`, `Booking` | `stays`, `bookings` 테이블과 연결된 객체 |
| `StayRepository`, `BookingRepository` | DB 조회와 저장 |
| `StayResponse`, `BookingRequest` | 응답과 요청의 JSON 모양 |
| `WebConfig` | 화면 주소(`airpnp.web-origin`)에서 오는 API 요청 허용(CORS) |
| `DataInitializer` | 시작할 때 숙소 9개와 예약 내역 등록 |

| API | 동작 |
|---|---|
| `GET /api/stays` | 숙소 목록과 숙소마다 가장 가까운 2박 빈 날짜 |
| `GET /api/stays/{id}` | 숙소 하나 |
| `POST /api/stays/{id}/bookings` | `{"guestName": "이름", "checkIn": "2026-10-20", "checkOut": "2026-10-22", "guests": 2}`로 예약 |
| `GET /api/stays/{id}/bookings` | 예약 내역 |

화면 구성은 에어비앤비의 홈, 숙소 상세와 예약 카드를 참고했습니다. 이름, 로고, 숙소 그림과 문구는 직접 만들었고 등장하는 숙소와 사람은 실제가 아니에요.

## 초기 버전에 없는 것

아래 동작은 2026년 10월 15일에 확인했습니다. 체크아웃 역순 날짜와 동시 예약은 코드 기준이며 영상에서 직접 재현해요. 편 번호는 [커리큘럼](../../curriculum.md)에서 이 문제를 다루는 영상이에요.

| 현재 동작 | 다루는 편 |
|---|---|
| 조회, 판단과 저장이 컨트롤러 한 곳에 있음 | 3편 |
| 최대 인원을 넘기거나 이름 없이 요청하면 500 | 5편 |
| 공백만 있는 이름, 체크아웃이 체크인보다 빠른 날짜도 저장됨 | 5편 |
| 없는 숙소를 열거나 예약하면 404가 아니라 500 | 6편 |
| 자동 테스트는 앱 시작 확인 하나뿐 | 7편 |
| 앱을 다시 시작하면 내가 한 예약이 사라짐 | 10편 |
| 목록 한 번에 SQL 10번 실행(숙소마다 예약 내역을 따로 조회) | 13편 |
| 숙소 검색이 없음 (검색창은 모양만 있음) | 14편 |
| 로그인과 회원이 없음 | 17, 18편 |
| 예약 내역 API가 다른 게스트의 이름까지 보여 줌 | 19편 |
| 이미 예약된 날짜에 직접 요청하면 겹치는 예약이 그대로 저장됨 | 22편 |
| 같은 날짜에 동시에 예약하면 둘 다 성공할 수 있음 | 23편 |
| 예약 취소가 없음 | 24편 |
| 결제가 없음 | 25, 26편 |

화면은 예약된 날짜를 달력에서 막고 겹치면 예약하기 버튼을 끕니다. 서버는 화면을 거치지 않은 요청을 따로 확인하지 않아요.

내 컴퓨터에서 실습하는 용도입니다. 권한 검사와 입력 검증을 추가하기 전에는 외부에 공개하지 않습니다.
