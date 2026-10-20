import { StrictMode, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { api, ApiError, type Stay } from './api';
import { formatRange, formatWon, nightsBetween, shortTitle } from './format';
import { ErrorMessage, Footer, Header, Icon, icons } from './layout';
import './style.css';

const tabs = [
	{ name: '숙소', color: '#e8553d' },
	{ name: '체험', color: '#7dbb6a' },
	{ name: '서비스', color: '#4a7fb3' },
];

function Home() {
	const [stays, setStays] = useState<Stay[]>();
	const [error, setError] = useState<ApiError>();

	useEffect(() => {
		api<Stay[]>('/api/stays').then(setStays, setError);
	}, []);

	const all = [...(stays ?? [])].sort((a, b) => b.id - a.id);
	const createdId = new URLSearchParams(location.search).get('created');
	const rows: [string, Stay[]][] = [
		['바다가 보이는 숙소', all.filter((stay) => stay.amenities?.includes('바다 전망'))],
		['한옥에서 보내는 하룻밤', all.filter((stay) => stay.stayType?.startsWith('한옥'))],
		[all.some((stay) => stay.nextCheckIn) ? '다음 주에 예약 가능한 숙소' : '모든 숙소', all],
	];

	return (
		<>
			<Header home below={<SearchBar />}>
				<nav className="tabs" aria-label="카테고리">
					{tabs.map((tab, index) => (
						<a key={tab.name} className="tab" href="/" aria-current={index === 0 ? 'page' : undefined}>
							<svg className="tab-icon" viewBox="0 0 32 32" aria-hidden="true">
								<circle cx="16" cy="16" r="11" fill={tab.color} opacity="0.85" />
							</svg>
							{tab.name}
						</a>
					))}
				</nav>
			</Header>
			<main className="container home">
				{createdId && stays?.some((stay) => String(stay.id) === createdId) && <p className="registration-success" role="status">숙소가 등록됐어요. 목록에서 새 숙소를 확인해 보세요.</p>}
				{error && <ErrorMessage error={error} />}
				{stays?.length === 0 && <ErrorMessage error={new ApiError('등록된 숙소가 없어요', '서버가 빈 목록을 보냈습니다.')} />}
				{rows.filter(([, list]) => list.length > 0).map(([title, list]) => (
					<StayRow key={title} title={title} stays={list} />
				))}
			</main>
			<Footer />
		</>
	);
}

function SearchBar() {
	return (
		<form className="search-bar" role="search" onSubmit={(event) => event.preventDefault()}>
			{[['여행지', '여행지 검색'], ['날짜', '날짜 추가'], ['여행자', '게스트 추가']].map(([label, placeholder]) => (
				<label key={label} className="search-field">
					<span className="search-label">{label}</span>
					<input type="text" placeholder={placeholder} />
				</label>
			))}
			<button className="search-button" type="submit" aria-label="검색">
				<Icon d={icons.search} />
			</button>
		</form>
	);
}

function StayRow({ title, stays }: { title: string; stays: Stay[] }) {
	const track = useRef<HTMLDivElement>(null);
	const scroll = (direction: number) =>
		track.current?.scrollBy({ left: direction * track.current.clientWidth, behavior: 'smooth' });

	return (
		<section className="stay-row">
			<div className="row-head">
				<h2 className="row-title">{title}</h2>
				<div className="row-arrows">
					<button className="arrow" type="button" aria-label="이전" onClick={() => scroll(-1)}>
						<Icon d={icons.left} />
					</button>
					<button className="arrow" type="button" aria-label="다음" onClick={() => scroll(1)}>
						<Icon d={icons.right} />
					</button>
				</div>
			</div>
			<div className="row-track" ref={track}>
				{stays.map((stay) => <StayCard key={stay.id} stay={stay} />)}
			</div>
		</section>
	);
}

function StayCard({ stay }: { stay: Stay }) {
	const { nextCheckIn: checkIn, nextCheckOut: checkOut } = stay;
	const nights = checkIn && checkOut ? nightsBetween(checkIn, checkOut) : 0;
	const dates = checkIn && checkOut ? `&check_in=${checkIn}&check_out=${checkOut}` : '';

	return (
		<a className="stay-card" href={`/stay.html?id=${stay.id}${dates}`}>
			<div className="card-photo">
				<img src={stay.imageUrl} alt="" loading="lazy" />
				{stay.guestFavorite && <span className="favorite-badge">게스트 선호</span>}
				<span className="heart" aria-hidden="true">
					<svg viewBox="0 0 24 24"><path d={icons.heart} /></svg>
				</span>
			</div>
			<p className="card-title">{shortTitle(stay)}</p>
			<p className="card-address">{stay.address}</p>
			{nights > 0 && <p className="card-dates">{formatRange(checkIn!, checkOut!)}</p>}
			<p className="card-price">
				<span>{nights > 0 ? `${nights}박 총액 ${formatWon(stay.pricePerNight * nights)}` : `1박 ${formatWon(stay.pricePerNight)}`}</span>
			</p>
		</a>
	);
}

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<Home />
	</StrictMode>,
);
