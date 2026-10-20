package com.apiece.airpnp;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.annotation.Transactional;

import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

@SpringBootTest
class RatingResponseTests {

	@Autowired
	private StayRepository stayRepository;

	@Autowired
	private JdbcTemplate jdbcTemplate;

	@Autowired
	private ObjectMapper objectMapper;

	@Test
	void responseUsesDifferentDatabaseRatings() {
		assertThat(stayRepository.findAll().stream().map(StayResponse::from).toList())
				.extracting(StayResponse::rating)
				.containsExactlyInAnyOrder(5.0, 4.9, 4.8, 4.7, 4.9, 4.8, 4.6, 4.7, 4.9);
	}

	@Test
	@Transactional
	void changedDatabaseRatingAppearsInJson() {
		jdbcTemplate.update("UPDATE stays SET rating = ? WHERE id = ?", 4.2, 1L);
		Stay stay = stayRepository.findById(1L).orElseThrow();
		JsonNode json = objectMapper.valueToTree(StayResponse.from(stay));
		assertThat(json.get("rating").asDouble()).isEqualTo(4.2);
	}
}
