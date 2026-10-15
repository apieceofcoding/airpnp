import { toIsoDate } from './format';

const monthFormat = new Intl.DateTimeFormat('ko-KR', { year: 'numeric', month: 'long' });
const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

interface Props {
	checkIn: string | null;
	checkOut: string | null;
	isBooked: (isoDate: string) => boolean;
	onSelect: (isoDate: string) => void;
}

export function Calendar(props: Props) {
	const today = new Date();
	return (
		<div className="calendar">
			<Month first={new Date(today.getFullYear(), today.getMonth(), 1)} {...props} />
			<Month first={new Date(today.getFullYear(), today.getMonth() + 1, 1)} {...props} />
		</div>
	);
}

function Month({ first, checkIn, checkOut, isBooked, onSelect }: Props & { first: Date }) {
	const todayIso = toIsoDate(new Date());
	const pickingCheckOut = checkIn !== null && checkOut === null;
	const dayCount = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
	const days = Array.from({ length: dayCount }, (_, index) =>
		toIsoDate(new Date(first.getFullYear(), first.getMonth(), index + 1)));

	return (
		<div className="month">
			<p className="month-title">{monthFormat.format(first)}</p>
			<div className="month-grid">
				{weekdays.map((weekday) => <span key={weekday} className="weekday">{weekday}</span>)}
				{Array.from({ length: first.getDay() }, (_, index) => <span key={`blank-${index}`} />)}
				{days.map((iso, index) => {
					const booked = iso >= todayIso && isBooked(iso);
					const inRange = checkIn !== null && checkOut !== null && iso > checkIn && iso < checkOut;
					const className = ['day', booked && 'booked', (iso === checkIn || iso === checkOut) && 'selected', inRange && 'in-range']
						.filter(Boolean).join(' ');
					return (
						<button
							key={iso}
							type="button"
							className={className}
							disabled={iso < todayIso || (booked && !(pickingCheckOut && iso > checkIn!))}
							onClick={() => onSelect(iso)}
						>
							{index + 1}
						</button>
					);
				})}
			</div>
		</div>
	);
}
