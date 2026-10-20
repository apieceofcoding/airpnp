package com.apiece.airpnp;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
class AirpnpApplicationTests {

	@Autowired
	private StayRepository stayRepository;

	@Autowired
	private JdbcTemplate jdbcTemplate;

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

	@Test
	void loadsDifferentRatingsFromDatabase() {
		assertThat(stayRepository.findAll()).extracting(Stay::getRating)
				.containsExactlyInAnyOrder(5.0, 4.9, 4.8, 4.7, 4.9, 4.8, 4.6, 4.7, 4.9);
	}

	@Test
	@Transactional
	void readsChangedDatabaseRating() {
		jdbcTemplate.update("UPDATE stays SET rating = ? WHERE id = ?", 4.2, 1L);
		assertThat(stayRepository.findById(1L)).isPresent()
				.get().extracting(Stay::getRating).isEqualTo(4.2);
	}

}
