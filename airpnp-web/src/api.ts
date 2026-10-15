// 화면과 서버가 따로 배포되므로 서버 주소를 환경마다 지정합니다.
export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';

// 편이 진행되며 서버가 필드를 하나씩 늘려 가므로 필수 필드 외에는 없어도 화면이 뜹니다.
export interface Stay {
	id: number;
	title: string;
	imageUrl: string;
	pricePerNight: number;
	region?: string;
	stayType?: string;
	hostName?: string;
	hostingYears?: number;
	description?: string;
	amenities?: string[];
	maxGuests?: number;
	bedrooms?: number;
	beds?: number;
	bathrooms?: number;
	rating?: number;
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

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
	const request = `${init?.method ?? 'GET'} ${path}`;
	const response = await fetch(`${API_URL}${path}`, init).catch(() => {
		throw new Error(`서버에 연결할 수 없어요. airpnp-server가 ${API_URL}에서 실행 중인지 확인해 주세요.`);
	});
	if (response.status === 404) {
		throw new Error(`${request}: 서버에 아직 없는 API이거나 없는 데이터예요. (404)`);
	}
	if (!response.ok) {
		throw new Error(`${request}: 서버가 ${response.status}로 응답했어요.`);
	}
	return response.json();
}
