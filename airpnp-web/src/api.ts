// 화면과 서버가 따로 배포되므로 서버 주소를 환경마다 지정합니다.
export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';

// 편이 진행되며 서버가 필드를 하나씩 늘려 가므로 필수 필드 외에는 없어도 화면이 뜹니다.
export interface Stay {
	id: number;
	title: string;
	imageUrl: string;
	pricePerNight: number;
	address: string;
	stayType?: string;
	hostName?: string;
	hostingYears?: number;
	description?: string;
	amenities?: string[];
	maxGuests?: number;
	bedrooms?: number;
	beds?: number;
	bathrooms?: number;
	reviewCount?: number;
	guestFavorite?: boolean;
	nextCheckIn?: string;
	nextCheckOut?: string;
}

export interface Booking {
	checkIn: string;
	checkOut: string;
	totalPrice: number;
}

// 화면에 실패 이유를 제목과 설명으로 보여 주기 위한 오류입니다.
export class ApiError extends Error {
	constructor(readonly title: string, message: string) {
		super(message);
	}
}

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
	const response = await fetch(`${API_URL}${path}`, init).catch(() => {
		throw new ApiError('서버에 연결할 수 없어요', `${API_URL}에서 응답이 없습니다. 서버가 켜져 있는지 확인해 주세요.`);
	});
	if (!response.ok) {
		throw new ApiError(init?.method === 'POST' ? '숙소를 등록하지 못했어요' : '숙소를 불러오지 못했어요', `서버가 ${response.status}로 응답했습니다. 입력한 내용과 서버 상태를 확인해 주세요.`);
	}
	return response.json();
}
