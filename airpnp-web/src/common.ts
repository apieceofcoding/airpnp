import type { Stay } from './api';

const won = new Intl.NumberFormat('ko-KR');

export function $<T extends Element = HTMLElement>(selector: string, root: ParentNode = document): T {
	return root.querySelector<T>(selector)!;
}

export function cloneTemplate<T extends Element>(selector: string): T {
	return $<HTMLTemplateElement>(selector).content.firstElementChild!.cloneNode(true) as T;
}

export function formatWon(amount: number): string {
	return `₩${won.format(amount)}`;
}

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
	if (start.getMonth() === end.getMonth()) {
		return `${head}~${end.getDate()}일`;
	}
	return `${head}~${end.getMonth() + 1}월 ${end.getDate()}일`;
}

export function shortTitle(stay: Stay): string {
	if (!stay.region) {
		return stay.title;
	}
	return `${stay.region.split(',')[0]}의 ${stay.stayType?.replace(' 전체', '') ?? '숙소'}`;
}

export function showPageMessage(root: HTMLElement, title: string, detail: string) {
	const box = document.createElement('div');
	box.className = 'load-error';
	const heading = document.createElement('h1');
	heading.textContent = title;
	const text = document.createElement('p');
	text.textContent = detail;
	box.append(heading, text);
	root.replaceChildren(box);
}

export function formatRating(rating: number): string {
	return rating.toFixed(2).replace(/0$/, '');
}
