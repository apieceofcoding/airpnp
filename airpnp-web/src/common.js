const won = new Intl.NumberFormat('ko-KR');

export function formatWon(amount) {
	return `₩${won.format(amount)}`;
}

export function parseDate(value) {
	const [year, month, day] = value.split('-').map(Number);
	return new Date(year, month - 1, day);
}

export function toIsoDate(date) {
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	return `${date.getFullYear()}-${month}-${day}`;
}

export function nightsBetween(checkIn, checkOut) {
	return Math.round((parseDate(checkOut) - parseDate(checkIn)) / 86400000);
}

export function formatRange(checkIn, checkOut) {
	const start = parseDate(checkIn);
	const end = parseDate(checkOut);
	const head = `${start.getMonth() + 1}월 ${start.getDate()}일`;
	if (start.getMonth() === end.getMonth()) {
		return `${head}~${end.getDate()}일`;
	}
	return `${head}~${end.getMonth() + 1}월 ${end.getDate()}일`;
}

export function shortTitle(stay) {
	return `${stay.region.split(',')[0]}의 ${stay.stayType.replace(' 전체', '')}`;
}

export function formatRating(rating) {
	return rating.toFixed(2).replace(/0$/, '');
}
