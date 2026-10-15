package com.apiece.airpnp;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/stays")
public class StayController {

	private static final int SUGGESTED_NIGHTS = 2;

	private final StayRepository stayRepository;

	private final BookingRepository bookingRepository;

	public StayController(StayRepository stayRepository, BookingRepository bookingRepository) {
		this.stayRepository = stayRepository;
		this.bookingRepository = bookingRepository;
	}

	@GetMapping
	public List<StayResponse> list() {
		return stayRepository.findAll().stream().map(this::toResponse).toList();
	}

	@GetMapping("/{stayId}")
	public StayResponse detail(@PathVariable Long stayId) {
		return toResponse(stayRepository.findById(stayId).orElseThrow());
	}

	@PostMapping("/{stayId}/bookings")
	public Booking book(@PathVariable Long stayId, @RequestBody BookingRequest request) {
		Stay stay = stayRepository.findById(stayId).orElseThrow();
		if (request.guests() > stay.getMaxGuests()) {
			throw new IllegalStateException("최대 인원을 넘었습니다.");
		}
		long nights = ChronoUnit.DAYS.between(request.checkIn(), request.checkOut());
		int totalPrice = (int) (nights * stay.getPricePerNight());
		return bookingRepository.save(new Booking(stayId, request.guestName(), request.checkIn(), request.checkOut(),
				request.guests(), totalPrice));
	}

	@GetMapping("/{stayId}/bookings")
	public List<Booking> bookings(@PathVariable Long stayId) {
		return bookingRepository.findByStayIdOrderByCheckInAsc(stayId);
	}

	private StayResponse toResponse(Stay stay) {
		List<Booking> bookings = bookingRepository.findByStayIdOrderByCheckInAsc(stay.getId());
		LocalDate checkIn = LocalDate.now().plusDays(1);
		for (Booking booking : bookings) {
			if (checkIn.plusDays(SUGGESTED_NIGHTS).isAfter(booking.getCheckIn()) && checkIn.isBefore(booking.getCheckOut())) {
				checkIn = booking.getCheckOut();
			}
		}
		return StayResponse.of(stay, checkIn, checkIn.plusDays(SUGGESTED_NIGHTS));
	}

}
