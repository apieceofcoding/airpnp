const dateFormat = new Intl.DateTimeFormat('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' });
const timeFormat = new Intl.DateTimeFormat('ko-KR', { hour: 'numeric', minute: '2-digit' });

const avatarColors = ['#3d5afe', '#e5372b', '#0f9d58', '#f59f00', '#8e44ad', '#00838f'];

function formatDateTime(startsAt) {
	const date = new Date(startsAt);
	return `${dateFormat.format(date)} ${timeFormat.format(date)}`;
}

function seatsLeft(meetup) {
	return meetup.capacity - meetup.registeredCount;
}

function createAvatar(name) {
	const avatar = document.createElement('span');
	avatar.className = 'avatar';
	avatar.textContent = name.charAt(0) || '?';
	avatar.style.backgroundColor = avatarColors[name.charCodeAt(0) % avatarColors.length] || avatarColors[0];
	return avatar;
}
