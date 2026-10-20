import { StrictMode, useRef, useState, type FormEvent } from 'react';
import { createRoot } from 'react-dom/client';
import { api, ApiError, type Stay } from './api';
import { formatWon } from './format';
import { Footer, Header } from './layout';
import './style.css';

function HostPage() {
    const [title, setTitle] = useState('');
    const [address, setAddress] = useState('');
    const [price, setPrice] = useState('');
    const [error, setError] = useState<string>();
    const [saving, setSaving] = useState(false);
    const submitting = useRef(false);
    const amount = Number(price);

    const submit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (submitting.current) return;
        if (!title.trim() || !address.trim() || !Number.isSafeInteger(amount) || amount < 1 || amount > 100_000_000) {
            setError('이름과 주소를 입력하고, 1박 가격은 1원부터 1억 원 사이의 정수로 적어 주세요.');
            return;
        }
        submitting.current = true;
        setSaving(true);
        setError(undefined);
        try {
            const stay = await api<Stay>('/api/stays', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: title.trim(), address: address.trim(), pricePerNight: amount }),
            });
            window.location.assign(`/?created=${encodeURIComponent(stay.id)}`);
        } catch (cause) {
            setError(cause instanceof ApiError ? `${cause.title} ${cause.message}` : '등록하지 못했어요. 잠시 후 다시 시도해 주세요.');
            submitting.current = false;
            setSaving(false);
        }
    };

    return (
        <>
            <Header hosting />
            <main className="container narrow hosting-page">
                <div className="hosting-heading">
                    <p className="hosting-eyebrow">나만의 공간, 새로운 여행의 시작</p>
                    <h1>어떤 숙소인지 알려주세요</h1>
                    <p>이름, 주소, 1박 요금만 입력하면 준비 끝이에요.</p>
                </div>
                <div className="hosting-layout">
                    <form className="hosting-form" onSubmit={submit} aria-busy={saving}>
                        <label className="hosting-field" htmlFor="stay-title">
                            <span>숙소 이름</span>
                            <input id="stay-title" name="title" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="예: 바다 앞에서 쉬어가는 집" maxLength={80} required />
                        </label>
                        <label className="hosting-field" htmlFor="stay-address">
                            <span>주소</span>
                            <input id="stay-address" name="address" value={address} onChange={(event) => setAddress(event.target.value)} placeholder="예: 강원특별자치도 강릉시 해안로 123" maxLength={200} required />
                        </label>
                        <label className="hosting-field" htmlFor="stay-price">
                            <span>1박 가격</span>
                            <div className="hosting-price-input">
                                <span aria-hidden="true">₩</span>
                                <input id="stay-price" name="pricePerNight" type="number" inputMode="numeric" value={price} onChange={(event) => setPrice(event.target.value)} placeholder="148000" min={1} max={100000000} step={1} required />
                                <span aria-hidden="true">/ 박</span>
                            </div>
                        </label>
                        <p className="hosting-note">사진은 기본 이미지로 표시됩니다. 등록한 숙소는 목록에서 바로 확인할 수 있어요.</p>
                        {error && <p className="hosting-error" role="alert">{error}</p>}
                        <div className="hosting-form-actions">
                            <a className="hosting-cancel" href="/">취소</a>
                            <button className="hosting-submit" type="submit" disabled={saving}>{saving ? '등록하는 중…' : '숙소 등록하기'}</button>
                        </div>
                    </form>
                    <aside className="hosting-preview" aria-label="등록할 숙소 미리보기">
                        <p className="hosting-preview-label">이렇게 소개돼요</p>
                        <img src="/images/rooms/living.svg" alt="기본 숙소 이미지" />
                        <div className="hosting-preview-copy">
                            <h2>{title.trim() || '여행자가 머물고 싶은 공간'}</h2>
                            <p>{address.trim() || '숙소의 주소가 표시됩니다'}</p>
                            <div className="hosting-preview-price">{Number.isFinite(amount) && amount > 0 ? <><strong>{formatWon(amount)}</strong> / 박</> : '1박 요금을 입력해 주세요'}</div>
                        </div>
                    </aside>
                </div>
            </main>
            <Footer />
        </>
    );
}

createRoot(document.getElementById('root')!).render(<StrictMode><HostPage /></StrictMode>);
