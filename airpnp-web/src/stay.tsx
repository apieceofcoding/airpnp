import { StrictMode, useCallback, useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { api, type ApiError, type Booking, type Stay } from './api';
import { Calendar } from './Calendar';
import { formatRange, formatWon, nightsBetween, parseDate } from './format';
import { ErrorMessage, Footer, Header, Icon, icons } from './layout';
import './style.css';

const params = new URLSearchParams(location.search);
const stayPath = `/api/stays/${encodeURIComponent(params.get('id') ?? '')}`;
const longDate = new Intl.DateTimeFormat('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
const avatarColors = ['#222222', '#e61e4d', '#008489', '#c13515', '#6b4a33', '#3d5afe'];
const rooms = [
	['maxGuests', '최대 인원', '명'],
	['bedrooms', '침실', '개'],
	['beds', '침대', '개'],
	['bathrooms', '욕실', '개'],
] as const;

function StayPage() {
	const [stay, setStay] = useState<Stay>();
	const [bookings, setBookings] = useState<Booking[]>([]);
	const [error, setError] = useState<ApiError>();
	const [status, setStatus] = useState({ message: '', isError: false });
	const [checkIn, setCheckIn] = useState(params.get('check_in'));
	const [checkOut, setCheckOut] = useState(params.get('check_out'));
	const [guestName, setGuestName] = useState('');
	const [guests, setGuests] = useState(1);

	// 예약 API가 아직 없거나 실패해도 예약 내역을 비워 두고 상세 화면은 그립니다.
	const loadBookings = useCallback(() => {
		api<Booking[]>(`${stayPath}/bookings`).then(setBookings, () => setBookings([]));
	}, []);

	useEffect(() => {
		api<Stay>(stayPath).then((loaded) => {
			setStay(loaded);
			document.title = `${loaded.title} | airpnp`;
			setCheckIn((value) => value ?? loaded.nextCheckIn ?? null);
			setCheckOut((value) => value ?? loaded.nextCheckOut ?? null);
			loadBookings();
		}, setError);
	}, [loadBookings]);

	if (error) {
		return <Page><ErrorMessage error={error} /></Page>;
	}
	if (!stay) {
		return <Page />;
	}

	const isBooked = (iso: string) => bookings.some((booking) => booking.checkIn <= iso && iso < booking.checkOut);
	const overlaps = (from: string, to: string) => bookings.some((booking) => from < booking.checkOut && booking.checkIn < to);
	const range = checkIn && checkOut ? { from: checkIn, to: checkOut } : null;
	const nights = range ? nightsBetween(range.from, range.to) : 0;
	const total = nights * stay.pricePerNight;
	const overlap = range !== null && overlaps(range.from, range.to);
	const city = stay.address?.split(',')[0] ?? stay.title;

	const selectDate = (iso: string) => {
		if (checkIn && !checkOut && iso > checkIn && !overlaps(checkIn, iso)) {
			setCheckOut(iso);
		} else {
			setCheckIn(iso);
			setCheckOut(null);
		}
	};

	const book = async (event: FormEvent) => {
		event.preventDefault();
		try {
			const booking = await api<Booking>(`${stayPath}/bookings`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ guestName, checkIn, checkOut, guests }),
			});
			setStatus({ message: `예약이 완료됐어요. ${formatRange(booking.checkIn, booking.checkOut)}, 총액 ${formatWon(booking.totalPrice)}`, isError: false });
			setGuestName('');
			setCheckIn(null);
			setCheckOut(null);
		} catch (e) {
			setStatus({ message: `예약하지 못했어요. ${(e as Error).message}`, isError: true });
		}
		loadBookings();
	};

	return (
		<Page>
			<div className="title-row">
				<h1>{stay.title}</h1>
				<div className="title-actions">
					<button type="button" className="text-button"><Icon d={icons.share} /><span>공유하기</span></button>
					<button type="button" className="text-button"><Icon d={icons.heart} /><span>저장</span></button>
				</div>
			</div>

			<div className="gallery">
				<img className="gallery-main" src={stay.imageUrl} alt="" />
				{['living', 'bedroom', 'kitchen', 'bathroom'].map((room) => <img key={room} src={`/images/rooms/${room}.svg`} alt="" />)}
			</div>

			<div className="detail-layout">
				<article className="detail-main">
					<section className="overview">
						<h2>{stay.address && stay.stayType ? `${stay.address}의 ${stay.stayType}` : stay.title}</h2>
						<p className="muted">{stay.address}</p>
						<p className="rooms">
							{rooms.filter(([key]) => stay[key] !== undefined).map(([key, label, unit]) => `${label} ${stay[key]}${unit}`).join(', ')}
						</p>
					</section>

					{stay.hostName && (
						<section className="host-row">
							<span className="avatar" style={{ backgroundColor: avatarColors[stay.hostName.charCodeAt(0) % avatarColors.length] }}>
								{stay.hostName.charAt(0)}
							</span>
							<div>
								<p className="host-name">호스트: {stay.hostName}님</p>
								{stay.hostingYears !== undefined && <p className="muted">호스팅 경력 {stay.hostingYears}년</p>}
							</div>
						</section>
					)}

					{stay.description && <section><p className="description">{stay.description}</p></section>}

					{stay.amenities && (
						<section>
							<h2>숙소 편의시설</h2>
							<ul className="amenities">{stay.amenities.map((amenity) => <li key={amenity}>{amenity}</li>)}</ul>
						</section>
					)}

					<section>
						<h2 className="calendar-title">{range ? `${city}에서 ${nights}박` : '체크인 날짜를 선택하세요'}</h2>
						<p className="muted">
							{range ? `${longDate.format(parseDate(range.from))} ~ ${longDate.format(parseDate(range.to))}` : '여행 날짜를 입력하여 정확한 요금을 확인하세요.'}
						</p>
						<Calendar checkIn={checkIn} checkOut={checkOut} isBooked={isBooked} onSelect={selectDate} />
					</section>
				</article>

				<aside className="booking-card">
					<p className="price-line">
						<strong>{range ? `총액 ${formatWon(total)}` : `${formatWon(stay.pricePerNight)} /박`}</strong>{' '}
						<span className="muted">{range ? `${nights}박` : ''}</span>
					</p>
					<form onSubmit={book}>
						<div className="booking-box">
							<div className="box-cell"><span className="box-label">체크인</span>{formatBoxDate(checkIn)}</div>
							<div className="box-cell"><span className="box-label">체크아웃</span>{formatBoxDate(checkOut)}</div>
							<label className="box-cell wide">
								<span className="box-label">인원</span>
								<select value={guests} onChange={(event) => setGuests(Number(event.target.value))}>
									{Array.from({ length: stay.maxGuests ?? 1 }, (_, index) => (
										<option key={index} value={index + 1}>게스트 {index + 1}명</option>
									))}
								</select>
							</label>
							<label className="box-cell wide">
								<span className="box-label">예약자 이름</span>
								<input value={guestName} onChange={(event) => setGuestName(event.target.value)} placeholder="이름을 적어 주세요" required />
							</label>
						</div>
						<button type="submit" className="book-button" disabled={!range || overlap}>
							{overlap ? '이미 예약된 날짜가 있어요' : '예약하기'}
						</button>
					</form>
					<p className="muted center">예약 확정 전에는 요금이 청구되지 않습니다.</p>
					{range && (
						<dl className="breakdown">
							<div><dt>{formatWon(stay.pricePerNight)} x {nights}박</dt><dd>{formatWon(total)}</dd></div>
							<div className="sum"><dt>총액</dt><dd>{formatWon(total)}</dd></div>
						</dl>
					)}
					{status.message && <p className={status.isError ? 'status error' : 'status'} role="status">{status.message}</p>}
				</aside>
			</div>
		</Page>
	);
}

function Page({ children }: { children?: ReactNode }) {
	return (
		<>
			<Header>
				<a className="mini-search" href="/">
					<span>어디든지</span>
					<span>언제든 일주일</span>
					<span className="muted">게스트 추가</span>
					<span className="mini-search-button"><Icon d={icons.search} /></span>
				</a>
			</Header>
			<main className="container narrow detail">{children}</main>
			<Footer />
		</>
	);
}

const formatBoxDate = (iso: string | null) => (iso ? `${iso.replaceAll('-', '. ')}.` : '날짜 추가');

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<StayPage />
	</StrictMode>,
);
