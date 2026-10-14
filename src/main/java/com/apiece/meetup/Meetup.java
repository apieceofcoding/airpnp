package com.apiece.meetup;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "meetups")
public class Meetup {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String title;

	private String category;

	private String district;

	private String location;

	private String hostName;

	@Column(length = 1000)
	private String description;

	private String imageUrl;

	private LocalDateTime startsAt;

	private int capacity;

	protected Meetup() {
	}

	public Meetup(String title, String category, String district, String location, String hostName,
			String description, String imageUrl, LocalDateTime startsAt, int capacity) {
		this.title = title;
		this.category = category;
		this.district = district;
		this.location = location;
		this.hostName = hostName;
		this.description = description;
		this.imageUrl = imageUrl;
		this.startsAt = startsAt;
		this.capacity = capacity;
	}

	public Long getId() {
		return id;
	}

	public String getTitle() {
		return title;
	}

	public String getCategory() {
		return category;
	}

	public String getDistrict() {
		return district;
	}

	public String getLocation() {
		return location;
	}

	public String getHostName() {
		return hostName;
	}

	public String getDescription() {
		return description;
	}

	public String getImageUrl() {
		return imageUrl;
	}

	public LocalDateTime getStartsAt() {
		return startsAt;
	}

	public int getCapacity() {
		return capacity;
	}

}
