import type { Stay } from './api';

const won = new Intl.NumberFormat('ko-KR');

export const formatWon = (amount: number) => `₩${won.format(amount)}`;

export function parseDate(value: string): Date {
	const [year, month, day] = value.split('-').map(Number);
	return new Date(year, month - 1, day);
}

export function toIsoDate(date: Date): string {
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	return `${date.getFullYear()}-${month}-${day}`;
}

export function nightsBetween(checkIn: string, checkOut: string): number {
	return Math.round((parseDate(checkOut).getTime() - parseDate(checkIn).getTime()) / 86400000);
}

export function formatRange(checkIn: string, checkOut: string): string {
	const start = parseDate(checkIn);
	const end = parseDate(checkOut);
	const head = `${start.getMonth() + 1}월 ${start.getDate()}일`;
	return start.getMonth() === end.getMonth() ? `${head}~${end.getDate()}일` : `${head}~${end.getMonth() + 1}월 ${end.getDate()}일`;
}

export function shortTitle(stay: Stay): string {
	if (!stay.address || !stay.stayType) {
		return stay.title;
	}
	return `${stay.address.split(',')[0]}의 ${stay.stayType.replace(' 전체', '')}`;
}
