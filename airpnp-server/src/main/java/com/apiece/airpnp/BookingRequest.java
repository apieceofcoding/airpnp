package com.apiece.airpnp;

import java.time.LocalDate;

public record BookingRequest(String guestName, LocalDate checkIn, LocalDate checkOut, int guests) {

}
