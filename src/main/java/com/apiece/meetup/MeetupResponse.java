package com.apiece.meetup;

import java.time.LocalDateTime;

public record MeetupResponse(Long id, String title, String category, String district, String location,
		String hostName, String description, String imageUrl, LocalDateTime startsAt, int capacity,
		long registeredCount) {

	public static MeetupResponse of(Meetup meetup, long registeredCount) {
		return new MeetupResponse(meetup.getId(), meetup.getTitle(), meetup.getCategory(), meetup.getDistrict(),
				meetup.getLocation(), meetup.getHostName(), meetup.getDescription(), meetup.getImageUrl(),
				meetup.getStartsAt(), meetup.getCapacity(), registeredCount);
	}

}
