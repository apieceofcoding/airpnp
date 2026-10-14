const grid = document.querySelector('#meetup-grid');
const chips = document.querySelector('#category-chips');
const summary = document.querySelector('#summary');
const cardTemplate = document.querySelector('#card-template');

let meetups = [];
let selectedCategory = '전체';

async function loadMeetups() {
	const response = await fetch('/api/meetups');
	meetups = await response.json();
	renderChips();
	renderCards();
}

function renderChips() {
	const categories = ['전체', ...new Set(meetups.map((meetup) => meetup.category))];
	chips.replaceChildren(...categories.map((category) => {
		const chip = document.createElement('button');
		chip.type = 'button';
		chip.className = 'chip';
		chip.textContent = category;
		chip.setAttribute('aria-pressed', category === selectedCategory);
		chip.addEventListener('click', () => {
			selectedCategory = category;
			renderChips();
			renderCards();
		});
		return chip;
	}));
}

function renderCards() {
	const visible = meetups.filter((meetup) => selectedCategory === '전체' || meetup.category === selectedCategory);
	const open = visible.filter((meetup) => seatsLeft(meetup) > 0);
	summary.textContent = `지금 신청할 수 있는 모임 ${open.length}개`;
	grid.replaceChildren(...visible.map(renderCard));
}

function renderCard(meetup) {
	const card = cardTemplate.content.firstElementChild.cloneNode(true);
	const left = seatsLeft(meetup);

	card.href = `/meetup.html?id=${meetup.id}`;
	card.querySelector('img').src = meetup.imageUrl;
	card.querySelector('.district').textContent = meetup.district;
	card.querySelector('.category').textContent = meetup.category;
	card.querySelector('.title').textContent = meetup.title;
	card.querySelector('.when').textContent = formatDateTime(meetup.startsAt);
	card.querySelector('.where').textContent = meetup.location;
	card.querySelector('.people').textContent = `${meetup.registeredCount}/${meetup.capacity}명 신청`;

	const badge = card.querySelector('.badge');
	if (left <= 0) {
		card.classList.add('full');
		badge.textContent = '마감';
		badge.hidden = false;
	} else if (left <= 2) {
		badge.textContent = `${left}자리 남음`;
		badge.hidden = false;
	}
	return card;
}

loadMeetups();
