package com.apiece.meetup;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface MeetupRepository extends JpaRepository<Meetup, Long> {

	List<Meetup> findAllByOrderByStartsAtAsc();

}
