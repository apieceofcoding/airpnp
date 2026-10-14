package com.apiece.meetup;

import java.time.LocalDate;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

	private final MeetupRepository meetupRepository;

	private final RegistrationRepository registrationRepository;

	public DataInitializer(MeetupRepository meetupRepository, RegistrationRepository registrationRepository) {
		this.meetupRepository = meetupRepository;
		this.registrationRepository = registrationRepository;
	}

	@Override
	public void run(String... args) {
		if (meetupRepository.count() > 0) {
			return;
		}
		LocalDate today = LocalDate.now();

		add(new Meetup("한강 아침 러닝 5K", "액티비티", "영등포구", "여의나루역 2번 출구", "도윤",
				"출근 전에 한강을 따라 5km를 천천히 뜁니다.\n1km에 7분 정도로, 이야기하며 달릴 수 있는 속도예요.\n\n"
						+ "처음 뛰는 분도 괜찮습니다. 끝나고 편의점 앞에서 가볍게 인사하고 헤어져요.",
				"/images/posters/running.svg", today.plusDays(2).atTime(7, 0), 6), "서준", "하은", "민재");

		add(new Meetup("핸드드립 처음 배우기", "푸드", "종로구", "서촌 골목 로스터리 2층", "유나",
				"원두 두 가지를 직접 내려 보고 맛을 비교합니다.\n드리퍼와 주전자는 준비되어 있어요.\n\n"
						+ "커피를 잘 몰라도 됩니다. 물 온도와 붓는 속도만 바꿔도 맛이 달라지는 걸 확인해 봐요.",
				"/images/posters/coffee.svg", today.plusDays(3).atTime(14, 0), 5), "지우", "현우", "소연", "예준");

		add(new Meetup("퇴근 후 보드게임 한 판", "취미", "마포구", "합정역 근처 보드게임 카페", "태민",
				"규칙은 와서 배우면 됩니다.\n30분 안에 끝나는 게임 위주로 두세 판 진행해요.\n\n" + "혼자 오는 분이 대부분이에요.",
				"/images/posters/boardgame.svg", today.plusDays(3).atTime(19, 30), 4), "수빈", "동현", "채원", "지호");

		add(new Meetup("AI로 만든 서비스 회고", "자기계발", "성동구", "성수동 공유 오피스 3층", "하준",
				"각자 만든 서비스를 5분씩 보여주고 막힌 부분을 나눕니다.\n완성하지 못한 서비스도 환영해요.\n\n"
						+ "노트북을 가져오면 좋습니다. 발표 자료는 필요 없어요.",
				"/images/posters/dev.svg", today.plusDays(5).atTime(19, 30), 8), "시우", "나연");

		add(new Meetup("한 달 한 권, 느린 독서 모임", "자기계발", "마포구", "연남동 동네 책방", "서연",
				"한 달 동안 같은 책을 읽고 한 번 만나 이야기합니다.\n이번 달 책은 신청하신 분께 따로 알려 드려요.\n\n"
						+ "다 읽지 못해도 괜찮습니다. 읽은 만큼만 이야기해요.",
				"/images/posters/book.svg", today.plusDays(6).atTime(19, 0), 8), "은우", "다인", "주원", "가윤", "선우");

		add(new Meetup("북한산 둘레길 걷기", "액티비티", "강북구", "우이역 2번 출구", "성훈",
				"정상까지 가지 않고 둘레길 1구간과 2구간을 걷습니다.\n2시간 반 정도 걸리고 중간에 한 번 쉬어요.\n\n"
						+ "운동화면 충분합니다. 물 한 병만 챙겨 오세요.",
				"/images/posters/hiking.svg", today.plusDays(7).atTime(9, 0), 10), "지안", "도현", "수아", "우진");

		add(new Meetup("제철 재료로 파스타 만들기", "푸드", "용산구", "해방촌 공유 주방", "은지",
				"장을 같이 보고 파스타 두 가지를 만듭니다.\n만든 음식은 함께 먹고, 남으면 싸 가요.\n\n"
						+ "칼질이 서툴러도 괜찮습니다. 앞치마는 준비되어 있어요.",
				"/images/posters/pasta.svg", today.plusDays(9).atTime(12, 0), 6), "유진");

		add(new Meetup("필름 카메라 들고 익선동 산책", "취미", "종로구", "종로3가역 4번 출구", "재현",
				"필름 한 롤을 들고 익선동 골목을 한 시간 반 걷습니다.\n카메라가 없으면 일회용 카메라를 빌려 드려요.\n\n"
						+ "찍은 사진은 현상한 뒤 함께 봅니다.",
				"/images/posters/film.svg", today.plusDays(10).atTime(15, 0), 6), "하린", "건우", "서아");

		add(new Meetup("영화 보고 수다 떨기", "취미", "서대문구", "연희동 작은 상영관", "가은",
				"단편 영화 두 편을 함께 보고 한 시간 이야기합니다.\n상영작은 모임 전날 공개해요.\n\n"
						+ "정답 없는 수다입니다. 좋았던 장면 하나만 골라 오세요.",
				"/images/posters/movie.svg", today.plusDays(12).atTime(20, 0), 7));
	}

	private void add(Meetup meetup, String... names) {
		Meetup saved = meetupRepository.save(meetup);
		for (String name : names) {
			registrationRepository.save(new Registration(saved.getId(), name));
		}
	}

}
