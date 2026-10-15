import type { ReactNode } from 'react';

export function Icon({ d, className = 'icon' }: { d: string; className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" aria-hidden="true">
			<path d={d} />
		</svg>
	);
}

export const icons = {
	search: 'M10.5 4a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zm5 11.5 5 5',
	menu: 'M4 7h16M4 12h16M4 17h16',
	left: 'm15 5-7 7 7 7',
	right: 'm9 5 7 7-7 7',
	share: 'M12 3v12M7 8l5-5 5 5M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6',
	heart: 'M12 20c5-3.4 9-7.2 9-12a5 5 0 0 0-9-2.9A5 5 0 0 0 3 8c0 4.8 4 8.6 9 12z',
};

export function Header({ children, below, home = false }: { children: ReactNode; below?: ReactNode; home?: boolean }) {
	return (
		<header className={home ? 'site-header home-header' : 'site-header'}>
			<div className={home ? 'container header-row' : 'container narrow header-row'}>
				<a className="logo" href="/">
					<img src="/images/logo.svg" alt="" width="32" height="32" />
					<span>airpnp</span>
				</a>
				{children}
				<div className="header-actions">
					<a className="host-link" href="/">호스트 되기</a>
					<button className="round-button" type="button" aria-label="메뉴">
						<Icon d={icons.menu} />
					</button>
				</div>
			</div>
			{below}
		</header>
	);
}

export function Footer() {
	return (
		<footer className="site-footer">
			<div className="container">
				<p>© 2026 airpnp. 실습용 예제 서비스입니다. 화면에 보이는 숙소, 호스트와 게스트는 실제가 아니에요.</p>
			</div>
		</footer>
	);
}

export function ErrorMessage({ message }: { message: string }) {
	return (
		<div className="load-error">
			<h1>화면을 불러오지 못했어요</h1>
			<p>{message}</p>
		</div>
	);
}
