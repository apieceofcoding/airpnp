package com.apiece.airpnp;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class StayController {

	@GetMapping("/api/stays")
	public List<StayResponse> list() {
		return List.of(
				new StayResponse(1L, "안목해변 바로 앞, 통창 오션뷰 아파트", "강릉시, 한국", "/images/stays/gangneung.svg", 148000),
				new StayResponse(2L, "귤밭 사이 돌담 독채", "제주시 애월읍, 한국", "/images/stays/jeju.svg", 189000));
	}

}
