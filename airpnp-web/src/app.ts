import { API_URL, request, type Stay } from './api';
import { $, cloneTemplate, formatRange, formatRating, formatWon, nightsBetween, shortTitle, showPageMessage } from './common';

const sections = $('#sections');

async function loadStays() {
	const response = await request(`${API_URL}/api/stays`);
	if (!response) {
		showPageMessage(sections, '서버에 연결할 수 없어요', `${API_URL}에서 응답이 없습니다. 서버가 켜져 있는지 확인해 주세요.`);
		return;
	}
	if (!response.ok) {
		showPageMessage(sections, '숙소를 불러오지 못했어요', `서버가 ${response.status}로 응답했습니다.`);
		return;
	}
	const stays: Stay[] = await response.json();

	const rows: [string, Stay[]][] = [
		['바다가 보이는 숙소', stays.filter((stay) => stay.amenities?.includes('바다 전망'))],
		['한옥에서 보내는 하룻밤', stays.filter((stay) => stay.stayType?.startsWith('한옥'))],
		[stays.some((stay) => stay.nextCheckIn) ? '다음 주에 예약 가능한 숙소' : '모든 숙소', stays],
	];
	sections.replaceChildren(...rows.filter(([, list]) => list.length > 0).map(([title, list]) => renderRow(title, list)));
}

function renderRow(title: string, stays: Stay[]): HTMLElement {
	const row = cloneTemplate<HTMLElement>('#section-template');
	const track = $('.row-track', row);

	$('.row-title', row).textContent = title;
	track.replaceChildren(...stays.map(renderCard));
	row.querySelectorAll<HTMLButtonElement>('.arrow').forEach((arrow) => {
		arrow.addEventListener('click', () => {
			track.scrollBy({ left: Number(arrow.dataset.dir) * track.clientWidth, behavior: 'smooth' });
		});
	});
	return row;
}

function renderCard(stay: Stay): HTMLAnchorElement {
	const card = cloneTemplate<HTMLAnchorElement>('#card-template');
	const { nextCheckIn, nextCheckOut } = stay;

	card.href = `/stay.html?id=${stay.id}`;
	$<HTMLImageElement>('img', card).src = stay.imageUrl;
	$('.favorite-badge', card).hidden = !stay.guestFavorite;
	$('.card-title', card).textContent = shortTitle(stay);
	if (nextCheckIn && nextCheckOut) {
		const nights = nightsBetween(nextCheckIn, nextCheckOut);
		card.href += `&check_in=${nextCheckIn}&check_out=${nextCheckOut}`;
		$('.card-dates', card).textContent = formatRange(nextCheckIn, nextCheckOut);
		$('.total', card).textContent = `${nights}박 총액 ${formatWon(stay.pricePerNight * nights)}`;
	} else {
		$('.card-dates', card).hidden = true;
		$('.total', card).textContent = `1박 ${formatWon(stay.pricePerNight)}`;
	}
	$('.rating', card).textContent = stay.rating === undefined ? '' : `★ ${formatRating(stay.rating)}`;
	return card;
}

loadStays();
