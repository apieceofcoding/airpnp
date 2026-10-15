import { API_URL } from './api.js';
import { formatRating, formatRange, formatWon, nightsBetween, shortTitle } from './common.js';

const sections = document.querySelector('#sections');
const sectionTemplate = document.querySelector('#section-template');
const cardTemplate = document.querySelector('#card-template');

async function loadStays() {
	const response = await fetch(`${API_URL}/api/stays`);
	const stays = await response.json();

	const rows = [
		['바다가 보이는 숙소', stays.filter((stay) => stay.amenities.includes('바다 전망'))],
		['한옥에서 보내는 하룻밤', stays.filter((stay) => stay.stayType.startsWith('한옥'))],
		['다음 주에 예약 가능한 숙소', stays],
	];
	sections.replaceChildren(...rows.filter(([, list]) => list.length > 0).map(([title, list]) => renderRow(title, list)));
}

function renderRow(title, stays) {
	const row = sectionTemplate.content.firstElementChild.cloneNode(true);
	const track = row.querySelector('.row-track');

	row.querySelector('.row-title').textContent = title;
	track.replaceChildren(...stays.map(renderCard));
	row.querySelectorAll('.arrow').forEach((arrow) => {
		arrow.addEventListener('click', () => {
			track.scrollBy({ left: Number(arrow.dataset.dir) * track.clientWidth, behavior: 'smooth' });
		});
	});
	return row;
}

function renderCard(stay) {
	const card = cardTemplate.content.firstElementChild.cloneNode(true);
	const nights = nightsBetween(stay.nextCheckIn, stay.nextCheckOut);

	card.href = `/stay.html?id=${stay.id}&check_in=${stay.nextCheckIn}&check_out=${stay.nextCheckOut}`;
	card.querySelector('img').src = stay.imageUrl;
	card.querySelector('.favorite-badge').hidden = !stay.guestFavorite;
	card.querySelector('.card-title').textContent = shortTitle(stay);
	card.querySelector('.card-dates').textContent = formatRange(stay.nextCheckIn, stay.nextCheckOut);
	card.querySelector('.total').textContent = `${nights}박 총액 ${formatWon(stay.pricePerNight * nights)}`;
	card.querySelector('.rating').textContent = `★ ${formatRating(stay.rating)}`;
	return card;
}

loadStays();
