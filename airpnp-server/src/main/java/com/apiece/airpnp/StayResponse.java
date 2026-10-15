package com.apiece.airpnp;

import java.time.LocalDate;
import java.util.List;

public record StayResponse(Long id, String title, String region, String stayType, String hostName, int hostingYears,
		String description, String imageUrl, List<String> amenities, int pricePerNight, int maxGuests, int bedrooms,
		int beds, int bathrooms, double rating, int reviewCount, boolean guestFavorite, LocalDate nextCheckIn,
		LocalDate nextCheckOut) {

	public static StayResponse of(Stay stay, LocalDate nextCheckIn, LocalDate nextCheckOut) {
		return new StayResponse(stay.getId(), stay.getTitle(), stay.getRegion(), stay.getStayType(),
				stay.getHostName(), stay.getHostingYears(), stay.getDescription(), stay.getImageUrl(),
				List.of(stay.getAmenities().split(",")), stay.getPricePerNight(), stay.getMaxGuests(),
				stay.getBedrooms(), stay.getBeds(), stay.getBathrooms(), stay.getRating(), stay.getReviewCount(),
				stay.isGuestFavorite(), nextCheckIn, nextCheckOut);
	}

}
