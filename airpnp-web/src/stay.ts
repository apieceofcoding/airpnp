import { API_URL, request, type Booking, type Stay } from './api';
import { $, formatRange, formatRating, formatWon, nightsBetween, parseDate, toIsoDate } from './common';

const params = new URLSearchParams(location.search);
const stayUrl = `${API_URL}/api/stays/${encodeURIComponent(params.get('id') ?? '')}`;

const form = $<HTMLFormElement>('#booking-form');
const guestsSelect = $<HTMLSelectElement>('#guests');
const nameInput = $<HTMLInputElement>('#guest-name');
const bookButton = $<HTMLButtonElement>('#book-button');
const statusLine = $('#status');

const avatarColors = ['#222222', '#e61e4d', '#008489', '#c13515', '#6b4a33', '#3d5afe'];
const monthFormat = new Intl.DateTimeFormat('ko-KR', { year: 'numeric', month: 'long' });
const longDate = new Intl.DateTimeFormat('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });

let stay: Stay;
let bookings: Booking[] = [];
let checkIn = params.get('check_in');
let checkOut = params.get('check_out');

async function loadStay() {
	const response = await request(stayUrl);
	if (!response) {
		$('#load-error h1').textContent = '서버에 연결할 수 없어요';
		$('#load-error p').textContent = `${API_URL}에서 응답이 없습니다. 서버가 켜져 있는지 확인해 주세요.`;
		$('#load-error').hidden = false;
		return;
	}
	if (!response.ok) {
		$('#load-error p').textContent = `서버가 ${response.status}로 응답했습니다.`;
		$('#load-error').hidden = false;
		return;
	}
	stay = await response.json();
	checkIn ??= stay.nextCheckIn ?? null;
	checkOut ??= stay.nextCheckOut ?? null;
	renderStay();
	await loadBookings();
	$('#detail').hidden = false;
}

async function loadBookings() {
	// 예약 API는 뒤 편에서 만듭니다. 그 전에는 예약이 없는 것으로 보고 화면을 그려요.
	const response = await request(`${stayUrl}/bookings`);
	bookings = response?.ok ? await response.json() : [];
	renderDates();
}

function renderStay() {
	document.title = `${stay.title} | airpnp`;
	$('#title').textContent = stay.title;
	$<HTMLImageElement>('#cover').src = stay.imageUrl;
	const hostName = stay.hostName ?? '호스트';
	$('#headline').textContent = [stay.region, stay.stayType].filter(Boolean).join('의 ');
	$('#rooms').textContent = stay.maxGuests === undefined ? ''
		: `최대 인원 ${stay.maxGuests}명, 침실 ${stay.bedrooms ?? 0}개, 침대 ${stay.beds ?? 0}개, 욕실 ${stay.bathrooms ?? 0}개`;
	$('#favorite-box').hidden = !stay.guestFavorite;
	$('#rating').textContent = stay.rating === undefined ? '-' : formatRating(stay.rating);
	$('#review-count').textContent = `${stay.reviewCount ?? 0}개`;
	$('#host-name').textContent = hostName;
	$('#host-years').textContent = stay.hostingYears === undefined ? '' : `호스팅 경력 ${stay.hostingYears}년`;
	$('#description').textContent = stay.description ?? '';

	const avatar = $('#host-avatar');
	avatar.textContent = hostName.charAt(0);
	avatar.style.backgroundColor = avatarColors[hostName.charCodeAt(0) % avatarColors.length];

	$('#amenities').replaceChildren(...(stay.amenities ?? []).map((amenity) => {
		const item = document.createElement('li');
		item.textContent = amenity;
		return item;
	}));

	guestsSelect.replaceChildren(...Array.from({ length: stay.maxGuests ?? 1 }, (_, index) => {
		const option = document.createElement('option');
		option.value = String(index + 1);
		option.textContent = `게스트 ${index + 1}명`;
		return option;
	}));
}

function isBookedNight(isoDate: string): boolean {
	return bookings.some((booking) => booking.checkIn <= isoDate && isoDate < booking.checkOut);
}

function overlapsBooking(from: string, to: string): boolean {
	return bookings.some((booking) => from < booking.checkOut && booking.checkIn < to);
}

function formatBoxDate(isoDate: string | null): string {
	return isoDate ? isoDate.replaceAll('-', '. ') + '.' : '날짜 추가';
}

function renderDates() {
	const range = checkIn && checkOut ? { from: checkIn, to: checkOut } : null;
	const nights = range ? nightsBetween(range.from, range.to) : 0;
	const total = nights * stay.pricePerNight;
	const overlap = range !== null && overlapsBooking(range.from, range.to);

	$('#check-in-text').textContent = formatBoxDate(checkIn);
	$('#check-out-text').textContent = formatBoxDate(checkOut);
	$('#price-total').textContent = range ? `총액 ${formatWon(total)}` : `${formatWon(stay.pricePerNight)} /박`;
	$('#price-nights').textContent = range ? `${nights}박` : '';
	$('#breakdown').hidden = !range;
	$('#breakdown-label').textContent = `${formatWon(stay.pricePerNight)} x ${nights}박`;
	$('#breakdown-amount').textContent = formatWon(total);
	$('#breakdown-total').textContent = formatWon(total);

	const city = stay.region?.split(',')[0] ?? '이 숙소';
	$('#calendar-title').textContent = range ? `${city}에서 ${nights}박` : '체크인 날짜를 선택하세요';
	$('#calendar-range').textContent = range
		? `${longDate.format(parseDate(range.from))} ~ ${longDate.format(parseDate(range.to))}`
		: '여행 날짜를 입력하여 정확한 요금을 확인하세요.';

	bookButton.disabled = !range || overlap;
	bookButton.textContent = overlap ? '이미 예약된 날짜가 있어요' : '예약하기';
	renderCalendar();
}

function renderCalendar() {
	const today = new Date();
	$('#calendar').replaceChildren(
		renderMonth(new Date(today.getFullYear(), today.getMonth(), 1)),
		renderMonth(new Date(today.getFullYear(), today.getMonth() + 1, 1)),
	);
}

function renderMonth(first: Date): HTMLElement {
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
	const pickingCheckOut = checkIn !== null && checkOut === null;
	const days = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
	for (let day = 1; day <= days; day++) {
		const iso = toIsoDate(new Date(first.getFullYear(), first.getMonth(), day));
		const booked = isBookedNight(iso);
		const button = document.createElement('button');
		button.type = 'button';
		button.className = 'day';
		button.textContent = String(day);
		button.disabled = iso < todayIso || (booked && !(pickingCheckOut && iso > checkIn!));
		button.classList.toggle('booked', iso >= todayIso && booked);
		button.classList.toggle('selected', iso === checkIn || iso === checkOut);
		button.classList.toggle('in-range', checkIn !== null && checkOut !== null && iso > checkIn && iso < checkOut);
		button.addEventListener('click', () => selectDate(iso));
		grid.append(button);
	}
	month.append(title, grid);
	return month;
}

function selectDate(iso: string) {
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
	const response = await fetch(`${stayUrl}/bookings`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ guestName: nameInput.value, checkIn, checkOut, guests: Number(guestsSelect.value) }),
	});

	if (response.ok) {
		const booking: Booking = await response.json();
		showStatus(`예약이 완료됐어요. ${formatRange(booking.checkIn, booking.checkOut)}, 총액 ${formatWon(booking.totalPrice)}`);
		nameInput.value = '';
		checkIn = null;
		checkOut = null;
	} else {
		showStatus(`예약하지 못했어요. 서버가 ${response.status}로 응답했습니다.`, true);
	}
	await loadBookings();
});

function showStatus(message: string, isError = false) {
	statusLine.textContent = message;
	statusLine.classList.toggle('error', isError);
}

loadStay();
