# 모임 예약 서비스 (조각모임)

[백엔드 커리큘럼](../curriculum.md)에서 함께 개선하는 예제 서비스의 초기 버전입니다. 모임 목록을 보고, 상세 화면에서 이름을 적어 신청할 수 있어요.

겉모습은 실제 서비스처럼 만들고, 서버는 일부러 작고 부족하게 시작합니다. 빠진 부분은 뒤 편에서 직접 재현하고 고쳐요.

## 실행

Java 25가 필요합니다. DB는 앱 안에서 함께 실행되므로 따로 설치하지 않아요.

```sh
./gradlew bootRun
```

Windows에서는 `.\gradlew.bat bootRun`을 사용합니다.

| 주소 | 용도 |
|---|---|
| http://localhost:8080 | 모임 목록 |
| http://localhost:8080/meetup.html?id=1 | 모임 상세와 신청 |
| http://localhost:8080/api/meetups | 화면이 받아 가는 JSON |
| http://localhost:8080/h2-console | DB 조회 화면 |

DB 조회 화면에는 JDBC URL `jdbc:h2:mem:meetup`, 사용자 `sa`, 빈 비밀번호로 접속합니다.

```sql
SELECT * FROM meetups;
SELECT * FROM registrations;
```

실행한 SQL은 터미널 로그에도 출력돼요.

## 구성

| 파일 | 역할 |
|---|---|
| `static/index.html`, `app.js` | 목록 화면. 분류를 고르면 받아 온 목록에서 걸러 보여 줌 |
| `static/meetup.html`, `meetup.js` | 상세 화면과 신청 |
| `static/common.js`, `style.css` | 두 화면이 함께 쓰는 날짜 표시, 아바타와 스타일 |
| `static/images` | 로고와 모임 포스터 9장 |
| `MeetupController` | 목록, 상세, 신청과 신청자 조회 API |
| `Meetup`, `Registration` | `meetups`, `registrations` 테이블과 연결된 객체 |
| `MeetupRepository`, `RegistrationRepository` | DB 조회와 저장 |
| `MeetupResponse`, `RegisterRequest` | 응답과 요청의 JSON 모양 |
| `DataInitializer` | 시작할 때 모임 9개와 신청 내역 등록 |

| API | 동작 |
|---|---|
| `GET /api/meetups` | 모임 목록과 신청 인원 |
| `GET /api/meetups/{id}` | 모임 하나 |
| `POST /api/meetups/{id}/registrations` | `{"name": "이름"}`으로 신청 |
| `GET /api/meetups/{id}/registrations` | 신청자 목록 |

화면 구성은 문토와 Luma의 목록, 상세와 신청 흐름을 참고했습니다. 이름, 로고, 포스터와 문구는 직접 만들었고 등장하는 모임과 사람은 실제가 아니에요.

## 초기 버전에 없는 것

아래 동작은 2026년 10월 13일에 직접 확인했습니다. 편 번호는 이 문제를 다루는 영상이에요.

| 현재 동작 | 다루는 편 |
|---|---|
| 모임 검색이 없음 | 3편 |
| 없는 모임을 열거나 신청하면 404가 아니라 500 | 5편 |
| 정원이 찬 모임에 직접 요청하면 500 | 5편 |
| 이름 없이 요청하면 `NullPointerException`으로 500 | 6편 |
| 앱을 다시 시작하면 내가 한 신청이 사라짐 | 7편 |
| 같은 이름으로 여러 번 신청할 수 있음 | 10편 |
| 로그인, 회원과 신청 취소가 없음 | 9, 11, 12, 13편 |
| 공백만 있는 이름도 저장됨 | 14편 |
| 자동 테스트는 앱 시작 확인 하나뿐 | 15편 |
| 조회, 판단과 저장이 컨트롤러 한 곳에 있음 | 16편 |
| 정원 확인과 저장 사이에 다른 요청이 끼어들 수 있음 | 24편 |

화면은 정원이 차면 신청 버튼을 막습니다. 서버는 화면을 거치지 않은 요청을 따로 확인하지 않아요.

내 컴퓨터에서 실습하는 용도입니다. 권한 검사와 입력 검증을 추가하기 전에는 외부에 공개하지 않습니다.
