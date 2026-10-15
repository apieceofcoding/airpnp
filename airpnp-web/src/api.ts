// 화면과 서버가 따로 배포되므로 서버 주소를 환경마다 지정합니다.
export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';

// 1편은 서버가 id, title, imageUrl, pricePerNight만 줘도 화면이 뜹니다.
// 나머지 필드는 편이 진행되면서 서버 응답에 추가되고, 추가되는 만큼 화면이 채워져요.
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
	id: number;
	stayId: number;
	guestName: string;
	checkIn: string;
	checkOut: string;
	guests: number;
	totalPrice: number;
}

// 서버가 꺼져 있으면 fetch가 예외를 던지므로, 응답이 없는 경우를 null로 구분합니다.
export async function request(url: string, init?: RequestInit): Promise<Response | null> {
	try {
		return await fetch(url, init);
	} catch {
		return null;
	}
}
