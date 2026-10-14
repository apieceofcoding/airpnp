const meetupId = new URLSearchParams(location.search).get('id');

const detail = document.querySelector('#detail');
const loadError = document.querySelector('#load-error');
const form = document.querySelector('#signup-form');
const nameInput = document.querySelector('#name');
const signupButton = document.querySelector('#signup-button');
const statusLine = document.querySelector('#status');

async function loadMeetup() {
	const response = await fetch(`/api/meetups/${encodeURIComponent(meetupId)}`);
	if (!response.ok) {
		loadError.querySelector('p').textContent = `모임을 불러오지 못했어요. 서버가 ${response.status}로 응답했습니다.`;
		loadError.hidden = false;
		return;
	}
	renderMeetup(await response.json());
	await loadMembers();
	detail.hidden = false;
}

function renderMeetup(meetup) {
	const left = seatsLeft(meetup);
	const when = formatDateTime(meetup.startsAt);

	document.title = `${meetup.title} | 조각모임`;
	document.querySelector('#cover').src = meetup.imageUrl;
	document.querySelector('#district').textContent = meetup.district;
	document.querySelector('#category').textContent = meetup.category;
	document.querySelector('#title').textContent = meetup.title;
	document.querySelector('#host-avatar').replaceChildren(createAvatar(meetup.hostName));
	document.querySelector('#host-name').textContent = meetup.hostName;
	document.querySelector('#when').textContent = when;
	document.querySelector('#where').textContent = meetup.location;
	document.querySelector('#people').textContent = `정원 ${meetup.capacity}명, 현재 ${meetup.registeredCount}명 신청`;
	document.querySelector('#description').textContent = meetup.description;

	document.querySelector('#signup-when').textContent = when;
	document.querySelector('#progress-bar').style.width = `${(meetup.registeredCount / meetup.capacity) * 100}%`;

	const seats = document.querySelector('#signup-seats');
	const isFull = left <= 0;
	seats.textContent = isFull ? '마감된 모임이에요' : `${left}자리 남았어요`;
	seats.classList.toggle('urgent', !isFull && left <= 2);
	nameInput.disabled = isFull;
	signupButton.disabled = isFull;
	signupButton.textContent = isFull ? '마감' : '신청하기';
}

async function loadMembers() {
	const response = await fetch(`/api/meetups/${encodeURIComponent(meetupId)}/registrations`);
	const registrations = await response.json();
	const members = document.querySelector('#members');

	document.querySelector('#member-count').textContent = registrations.length;
	document.querySelector('#no-members').hidden = registrations.length > 0;
	members.replaceChildren(...registrations.map((registration) => {
		const member = document.createElement('li');
		const name = document.createElement('span');
		name.textContent = registration.name;
		member.append(createAvatar(registration.name), name);
		return member;
	}));
}

form.addEventListener('submit', async (event) => {
	event.preventDefault();
	const response = await fetch(`/api/meetups/${encodeURIComponent(meetupId)}/registrations`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ name: nameInput.value }),
	});

	if (response.ok) {
		showStatus('신청했어요. 모임에서 만나요!');
		nameInput.value = '';
	} else {
		showStatus(`신청하지 못했어요. 서버가 ${response.status}로 응답했습니다.`, true);
	}
	await loadMeetup();
});

function showStatus(message, isError = false) {
	statusLine.textContent = message;
	statusLine.classList.toggle('error', isError);
}

loadMeetup();
