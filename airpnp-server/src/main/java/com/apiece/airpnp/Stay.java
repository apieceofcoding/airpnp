package com.apiece.airpnp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "stays")
public class Stay {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String title;

	private String region;

	private String stayType;

	private String hostName;

	private int hostingYears;

	@Column(length = 1000)
	private String description;

	private String imageUrl;

	private String amenities;

	private int pricePerNight;

	private int maxGuests;

	private int bedrooms;

	private int beds;

	private int bathrooms;

	private double rating;

	private int reviewCount;

	private boolean guestFavorite;

	protected Stay() {
	}

	public Stay(String title, String region, String stayType, String hostName, int hostingYears, String description,
			String imageUrl, String amenities, int pricePerNight, int maxGuests, int bedrooms, int beds, int bathrooms,
			double rating, int reviewCount, boolean guestFavorite) {
		this.title = title;
		this.region = region;
		this.stayType = stayType;
		this.hostName = hostName;
		this.hostingYears = hostingYears;
		this.description = description;
		this.imageUrl = imageUrl;
		this.amenities = amenities;
		this.pricePerNight = pricePerNight;
		this.maxGuests = maxGuests;
		this.bedrooms = bedrooms;
		this.beds = beds;
		this.bathrooms = bathrooms;
		this.rating = rating;
		this.reviewCount = reviewCount;
		this.guestFavorite = guestFavorite;
	}

	public Long getId() {
		return id;
	}

	public String getTitle() {
		return title;
	}

	public String getRegion() {
		return region;
	}

	public String getStayType() {
		return stayType;
	}

	public String getHostName() {
		return hostName;
	}

	public int getHostingYears() {
		return hostingYears;
	}

	public String getDescription() {
		return description;
	}

	public String getImageUrl() {
		return imageUrl;
	}

	public String getAmenities() {
		return amenities;
	}

	public int getPricePerNight() {
		return pricePerNight;
	}

	public int getMaxGuests() {
		return maxGuests;
	}

	public int getBedrooms() {
		return bedrooms;
	}

	public int getBeds() {
		return beds;
	}

	public int getBathrooms() {
		return bathrooms;
	}

	public double getRating() {
		return rating;
	}

	public int getReviewCount() {
		return reviewCount;
	}

	public boolean isGuestFavorite() {
		return guestFavorite;
	}

}
