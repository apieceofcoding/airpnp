package com.apiece.meetup;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface RegistrationRepository extends JpaRepository<Registration, Long> {

	long countByMeetupId(Long meetupId);

	List<Registration> findByMeetupIdOrderByIdAsc(Long meetupId);

}
