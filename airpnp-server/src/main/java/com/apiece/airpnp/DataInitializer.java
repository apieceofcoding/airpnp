package com.apiece.airpnp;

import java.time.LocalDate;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

	private final StayRepository stayRepository;

	private final BookingRepository bookingRepository;

	private final LocalDate today = LocalDate.now();

	public DataInitializer(StayRepository stayRepository, BookingRepository bookingRepository) {
		this.stayRepository = stayRepository;
		this.bookingRepository = bookingRepository;
	}

	@Override
	public void run(String... args) {
		Stay gangneung = stayRepository.save(new Stay("안목해변 바로 앞, 통창 오션뷰 아파트", "강릉시, 한국", "아파트 전체", "지윤", 4,
				"거실 통창으로 안목해변이 한눈에 보이는 숙소입니다.\n커피거리까지 걸어서 3분이에요.\n\n"
						+ "아침에는 창밖으로 해가 떠오릅니다. 셀프 체크인이라 늦게 도착해도 괜찮아요.",
				"/images/stays/gangneung.svg", "바다 전망,셀프 체크인,무료 주차,와이파이,에어컨,세탁기", 148000, 4, 1, 2, 1,
				4.92, 211, true));
		book(gangneung, "서준", 1, 3, 2);
		book(gangneung, "하은", 6, 8, 3);

		Stay jeju = stayRepository.save(new Stay("귤밭 사이 돌담 독채", "제주시 애월읍, 한국", "주택 전체", "현무", 7,
				"귤밭으로 둘러싸인 오래된 돌집을 고쳐 만든 독채입니다.\n마당에서 한라산이 보여요.\n\n"
						+ "겨울에는 마당의 귤을 직접 따 드실 수 있습니다. 애월 바다까지는 차로 10분이에요.",
				"/images/stays/jeju.svg", "정원,무료 주차,주방,바비큐 그릴,와이파이,세탁기", 189000, 4, 2, 2, 1, 4.97, 386, true));
		book(jeju, "민재", 2, 5, 4);

		Stay busan = stayRepository.save(new Stay("광안대교가 보이는 루프탑 숙소", "부산 수영구, 한국", "아파트 전체", "도윤", 3,
				"광안리 해수욕장까지 걸어서 1분입니다.\n루프탑에서 광안대교 야경을 볼 수 있어요.\n\n"
						+ "최대 6명까지 머물 수 있어 친구들과 여행하기 좋습니다.",
				"/images/stays/busan.svg", "바다 전망,루프탑,셀프 체크인,와이파이,에어컨,세탁기", 116000, 6, 2, 3, 1, 4.84,
				122, true));
		book(busan, "지우", 1, 2, 2);
		book(busan, "현우", 3, 5, 5);

		Stay gyeongju = stayRepository.save(new Stay("황리단길 골목 안 작은 한옥", "경주시, 한국", "한옥 전체", "소연", 5,
				"황리단길 골목 안쪽에 있는 조용한 한옥입니다.\n대릉원과 첨성대까지 걸어서 10분이에요.\n\n"
						+ "마루에 앉아 차 한잔하며 쉬어 가세요. 다도 세트가 준비되어 있습니다.",
				"/images/stays/gyeongju.svg", "마당,다도 세트,와이파이,난방,에어컨,주방", 132000, 3, 1, 1, 1, 4.95, 167, true));

		Stay seochon = stayRepository.save(new Stay("서촌 골목, 마당 있는 한옥 스테이", "서울 종로구, 한국", "한옥 전체", "예준", 6,
				"경복궁역에서 걸어서 7분, 서촌 골목 안의 한옥입니다.\n작은 마당과 툇마루가 있어요.\n\n"
						+ "주변에 작은 서점과 카페가 많아 산책하기 좋습니다.",
				"/images/stays/seochon.svg", "마당,셀프 체크인,와이파이,난방,에어컨,세탁기", 175000, 4, 2, 2, 1, 4.89, 298,
				false));
		book(seochon, "수빈", 1, 4, 2);

		Stay yeosu = stayRepository.save(new Stay("돌산 오션뷰 스파 펜션", "여수시, 한국", "펜션 전체", "태민", 2,
				"객실 안 스파에서 여수 밤바다를 볼 수 있습니다.\n돌산대교까지 차로 5분이에요.\n\n"
						+ "테라스에서 바비큐를 할 수 있고, 숯과 그릴은 준비되어 있습니다.",
				"/images/stays/yeosu.svg", "바다 전망,스파,바비큐 그릴,무료 주차,와이파이,에어컨", 210000, 4, 1, 2, 1, 4.78,
				94, false));

		Stay gapyeong = stayRepository.save(new Stay("잣나무 숲속 A자 오두막", "가평군, 한국", "오두막 전체", "은지", 3,
				"잣나무 숲 한가운데 있는 A자 오두막입니다.\n밤에는 불멍을, 아침에는 새소리를 즐길 수 있어요.\n\n"
						+ "서울에서 차로 1시간 거리입니다. 장작은 무료로 드려요.",
				"/images/stays/gapyeong.svg", "숲 전망,화로,무료 주차,주방,와이파이,난방", 158000, 2, 1, 1, 1, 4.98, 452,
				true));
		book(gapyeong, "동현", 0, 2, 2);
		book(gapyeong, "채원", 2, 4, 2);

		Stay jeonju = stayRepository.save(new Stay("한옥마을 담장 옆 독채", "전주시 완산구, 한국", "한옥 전체", "재현", 8,
				"전주 한옥마을 중심에 있는 독채 한옥입니다.\n경기전과 전동성당이 걸어서 5분이에요.\n\n"
						+ "아침에는 근처 콩나물국밥집을 추천해 드립니다.",
				"/images/stays/jeonju.svg", "마당,와이파이,난방,에어컨,주방,세탁기", 98000, 2, 1, 1, 1, 4.87, 189, false));

		Stay namhae = stayRepository.save(new Stay("다랭이마을 바다 위 하얀 독채", "남해군, 한국", "주택 전체", "가은", 4,
				"계단식 논 아래로 남해 바다가 펼쳐지는 독채입니다.\n모든 방에서 바다가 보여요.\n\n"
						+ "근처에 편의점이 없으니 먹을거리는 미리 준비해 오세요.",
				"/images/stays/namhae.svg", "바다 전망,테라스,무료 주차,주방,와이파이,에어컨", 167000, 5, 2, 3, 2, 4.93, 138,
				true));
		book(namhae, "지호", 4, 6, 4);
	}

	private void book(Stay stay, String guestName, int fromDays, int toDays, int guests) {
		int totalPrice = (toDays - fromDays) * stay.getPricePerNight();
		bookingRepository.save(new Booking(stay.getId(), guestName, today.plusDays(fromDays), today.plusDays(toDays),
				guests, totalPrice));
	}

}
