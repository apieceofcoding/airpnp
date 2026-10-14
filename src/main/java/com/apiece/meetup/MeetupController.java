package com.apiece.meetup;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/meetups")
public class MeetupController {

	private final MeetupRepository meetupRepository;

	private final RegistrationRepository registrationRepository;

	public MeetupController(MeetupRepository meetupRepository, RegistrationRepository registrationRepository) {
		this.meetupRepository = meetupRepository;
		this.registrationRepository = registrationRepository;
	}

	@GetMapping
	public List<MeetupResponse> list() {
		return meetupRepository.findAllByOrderByStartsAtAsc()
			.stream()
			.map(meetup -> MeetupResponse.of(meetup, registrationRepository.countByMeetupId(meetup.getId())))
			.toList();
	}

	@GetMapping("/{meetupId}")
	public MeetupResponse detail(@PathVariable Long meetupId) {
		Meetup meetup = meetupRepository.findById(meetupId).orElseThrow();
		return MeetupResponse.of(meetup, registrationRepository.countByMeetupId(meetupId));
	}

	@PostMapping("/{meetupId}/registrations")
	public Registration register(@PathVariable Long meetupId, @RequestBody RegisterRequest request) {
		Meetup meetup = meetupRepository.findById(meetupId).orElseThrow();
		long registeredCount = registrationRepository.countByMeetupId(meetupId);
		if (registeredCount >= meetup.getCapacity()) {
			throw new IllegalStateException("정원이 가득 찼습니다.");
		}
		return registrationRepository.save(new Registration(meetupId, request.name()));
	}

	@GetMapping("/{meetupId}/registrations")
	public List<Registration> registrations(@PathVariable Long meetupId) {
		return registrationRepository.findByMeetupIdOrderByIdAsc(meetupId);
	}

}
