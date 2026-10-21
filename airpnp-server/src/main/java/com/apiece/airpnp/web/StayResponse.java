package com.apiece.airpnp.web;

import com.apiece.airpnp.domain.Stay;

public record StayResponse(
    Long id,
    String title,
    String address,
    String imageUrl,
    int pricePerNight
) {

    public static StayResponse from(Stay stay) {
        return new StayResponse(
            stay.getId(),
            stay.getTitle(),
            stay.getAddress(),
            stay.getImageUrl(),
            stay.getPricePerNight()
        );
    }

}
