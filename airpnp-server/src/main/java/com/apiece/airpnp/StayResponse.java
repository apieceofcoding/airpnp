package com.apiece.airpnp;

public record StayResponse(
    Long id,
    String title,
    String region,
    String imageUrl,
    int pricePerNight,
    double rating
) {

    public static StayResponse from(Stay stay) {
        return new StayResponse(
            stay.getId(),
            stay.getTitle(),
            stay.getRegion(),
            stay.getImageUrl(),
            stay.getPricePerNight(),
            stay.getRating()
        );
    }

}
