package com.apiece.airpnp;

import com.apiece.airpnp.domain.Stay;
import com.apiece.airpnp.domain.StayRepository;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class AirpnpApplicationTests {

	@Autowired
	private StayRepository stayRepository;

	@Test
	void contextLoads() {
	}

	@Test
	void loadsNineStaysOnStartup() {
		assertThat(stayRepository.findAll()).hasSize(9);
		assertThat(stayRepository.findById(1L)).isPresent()
				.get().extracting(Stay::getTitle)
				.isEqualTo("안목해변 바로 앞, 통창 오션뷰 아파트");
	}

}
