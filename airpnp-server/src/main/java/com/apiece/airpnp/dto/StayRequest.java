package com.apiece.airpnp.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record StayRequest(
    @NotBlank @Size(max = 80) String title,
    @NotBlank @Size(max = 200) String address,
    @Positive @Max(100_000_000) int pricePerNight
) {}
