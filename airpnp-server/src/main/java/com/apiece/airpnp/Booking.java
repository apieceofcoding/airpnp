package com.apiece.airpnp;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "bookings")
public class Booking {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private Long stayId;

	private String guestName;

	private LocalDate checkIn;

	private LocalDate checkOut;

	private int guests;

	private int totalPrice;

	protected Booking() {
	}

	public Booking(Long stayId, String guestName, LocalDate checkIn, LocalDate checkOut, int guests, int totalPrice) {
		this.stayId = stayId;
		this.guestName = guestName.trim();
		this.checkIn = checkIn;
		this.checkOut = checkOut;
		this.guests = guests;
		this.totalPrice = totalPrice;
	}

	public Long getId() {
		return id;
	}

	public Long getStayId() {
		return stayId;
	}

	public String getGuestName() {
		return guestName;
	}

	public LocalDate getCheckIn() {
		return checkIn;
	}

	public LocalDate getCheckOut() {
		return checkOut;
	}

	public int getGuests() {
		return guests;
	}

	public int getTotalPrice() {
		return totalPrice;
	}

}
