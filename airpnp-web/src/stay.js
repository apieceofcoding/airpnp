import { API_URL } from './api.js';
import { formatRange, formatRating, formatWon, nightsBetween, parseDate, toIsoDate } from './common.js';

const params = new URLSearchParams(location.search);
const stayId = params.get('id');

const detail = document.querySelector('#detail');
const loadError = document.querySelector('#load-error');
const form = document.querySelector('#booking-form');
const guestsSelect = document.querySelector('#guests');
const nameInput = document.querySelector('#guest-name');
const bookButton = document.querySelector('#book-button');
const statusLine = document.querySelector('#status');
const calendar = document.querySelector('#calendar');

const avatarColors = ['#222222', '#e61e4d', '#008489', '#c13515', '#6b4a33', '#3d5afe'];
const monthFormat = new Intl.DateTimeFormat('ko-KR', { year: 'numeric', month: 'long' });
const longDate = new Intl.DateTimeFormat('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });

let stay;
let bookings = [];
let checkIn = params.get('check_in');
let checkOut = params.get('check_out');

async function loadStay() {
	const response = await fetch(`${API_URL}/api/stays/${encodeURIComponent(stayId)}`);
	if (!response.ok) {
		loadError.querySelector('p').textContent = `서버가 ${response.status}로 응답했습니다.`;
		loadError.hidden = false;
		return;
	}
	stay = await response.json();
	checkIn ??= stay.nextCheckIn;
	checkOut ??= stay.nextCheckOut;
	renderStay();
	await loadBookings();
	detail.hidden = false;
}

async function loadBookings() {
	const response = await fetch(`${API_URL}/api/stays/${encodeURIComponent(stayId)}/bookings`);
	bookings = await response.json();
	renderDates();
}

function renderStay() {
	document.title = `${stay.title} | airpnp`;
	document.querySelector('#title').textContent = stay.title;
	document.querySelector('#cover').src = stay.imageUrl;
	document.querySelector('#headline').textContent = `${stay.region}의 ${stay.stayType}`;
	document.querySelector('#rooms').textContent =
		`최대 인원 ${stay.maxGuests}명, 침실 ${stay.bedrooms}개, 침대 ${stay.beds}개, 욕실 ${stay.bathrooms}개`;
	document.querySelector('#favorite-box').hidden = !stay.guestFavorite;
	document.querySelector('#rating').textContent = formatRating(stay.rating);
	document.querySelector('#review-count').textContent = `${stay.reviewCount}개`;
	document.querySelector('#host-name').textContent = stay.hostName;
	document.querySelector('#host-years').textContent = `호스팅 경력 ${stay.hostingYears}년`;
	document.querySelector('#description').textContent = stay.description;

	const avatar = document.querySelector('#host-avatar');
	avatar.textContent = stay.hostName.charAt(0);
	avatar.style.backgroundColor = avatarColors[stay.hostName.charCodeAt(0) % avatarColors.length];

	document.querySelector('#amenities').replaceChildren(...stay.amenities.map((amenity) => {
		const item = document.createElement('li');
		item.textContent = amenity;
		return item;
	}));

	guestsSelect.replaceChildren(...Array.from({ length: stay.maxGuests }, (_, index) => {
		const option = document.createElement('option');
		option.value = index + 1;
		option.textContent = `게스트 ${index + 1}명`;
		return option;
	}));
}

function isBookedNight(isoDate) {
	return bookings.some((booking) => booking.checkIn <= isoDate && isoDate < booking.checkOut);
}

function overlapsBooking(from, to) {
	return bookings.some((booking) => from < booking.checkOut && booking.checkIn < to);
}

function renderDates() {
	const hasRange = checkIn && checkOut;
	const nights = hasRange ? nightsBetween(checkIn, checkOut) : 0;
	const total = nights * stay.pricePerNight;
	const overlap = hasRange && overlapsBooking(checkIn, checkOut);

	document.querySelector('#check-in-text').textContent = checkIn ? checkIn.replaceAll('-', '. ') + '.' : '날짜 추가';
	document.querySelector('#check-out-text').textContent = checkOut ? checkOut.replaceAll('-', '. ') + '.' : '날짜 추가';
	document.querySelector('#price-total').textContent = hasRange ? `총액 ${formatWon(total)}` : `${formatWon(stay.pricePerNight)} /박`;
	document.querySelector('#price-nights').textContent = hasRange ? `${nights}박` : '';
	document.querySelector('#breakdown').hidden = !hasRange;
	document.querySelector('#breakdown-label').textContent = `${formatWon(stay.pricePerNight)} x ${nights}박`;
	document.querySelector('#breakdown-amount').textContent = formatWon(total);
	document.querySelector('#breakdown-total').textContent = formatWon(total);

	const city = stay.region.split(',')[0];
	document.querySelector('#calendar-title').textContent = hasRange ? `${city}에서 ${nights}박` : '체크인 날짜를 선택하세요';
	document.querySelector('#calendar-range').textContent = hasRange
		? `${longDate.format(parseDate(checkIn))} ~ ${longDate.format(parseDate(checkOut))}`
		: '여행 날짜를 입력하여 정확한 요금을 확인하세요.';

	bookButton.disabled = !hasRange || overlap;
	bookButton.textContent = overlap ? '이미 예약된 날짜가 있어요' : '예약하기';
	renderCalendar();
}

function renderCalendar() {
	const today = new Date();
	calendar.replaceChildren(
		renderMonth(new Date(today.getFullYear(), today.getMonth(), 1)),
		renderMonth(new Date(today.getFullYear(), today.getMonth() + 1, 1)),
	);
}

function renderMonth(first) {
	const month = document.createElement('div');
	month.className = 'month';
	const title = document.createElement('p');
	title.className = 'month-title';
	title.textContent = monthFormat.format(first);

	const grid = document.createElement('div');
	grid.className = 'month-grid';
	for (const weekday of ['일', '월', '화', '수', '목', '금', '토']) {
		const label = document.createElement('span');
		label.className = 'weekday';
		label.textContent = weekday;
		grid.append(label);
	}
	for (let blank = 0; blank < first.getDay(); blank++) {
		grid.append(document.createElement('span'));
	}

	const todayIso = toIsoDate(new Date());
	const days = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
	for (let day = 1; day <= days; day++) {
		const iso = toIsoDate(new Date(first.getFullYear(), first.getMonth(), day));
		const button = document.createElement('button');
		button.type = 'button';
		button.className = 'day';
		button.textContent = day;
		button.disabled = iso < todayIso || (isBookedNight(iso) && !(checkIn && !checkOut && iso > checkIn));
		button.classList.toggle('booked', iso >= todayIso && isBookedNight(iso));
		button.classList.toggle('selected', iso === checkIn || iso === checkOut);
		button.classList.toggle('in-range', checkIn && checkOut && iso > checkIn && iso < checkOut);
		button.addEventListener('click', () => selectDate(iso));
		grid.append(button);
	}
	month.append(title, grid);
	return month;
}

function selectDate(iso) {
	if (checkIn && !checkOut && iso > checkIn && !overlapsBooking(checkIn, iso)) {
		checkOut = iso;
	} else {
		checkIn = iso;
		checkOut = null;
	}
	renderDates();
}

form.addEventListener('submit', async (event) => {
	event.preventDefault();
	const response = await fetch(`${API_URL}/api/stays/${encodeURIComponent(stayId)}/bookings`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ guestName: nameInput.value, checkIn, checkOut, guests: Number(guestsSelect.value) }),
	});

	if (response.ok) {
		const booking = await response.json();
		showStatus(`예약이 완료됐어요. ${formatRange(booking.checkIn, booking.checkOut)}, 총액 ${formatWon(booking.totalPrice)}`);
		nameInput.value = '';
		checkIn = null;
		checkOut = null;
	} else {
		showStatus(`예약하지 못했어요. 서버가 ${response.status}로 응답했습니다.`, true);
	}
	await loadBookings();
});

function showStatus(message, isError = false) {
	statusLine.textContent = message;
	statusLine.classList.toggle('error', isError);
}

loadStay();
