import { useEffect, useRef, useState } from 'react';
import { Button, Modal, Tag } from 'antd';
import s from './MatchesPage.module.scss';

type SearchState = 'idle' | 'searching' | 'found';

type SocialLink = {
	id: number;
	label: string;
	url: string;
};

type Candidate = {
	name: string;
	fullName: string;
	initials: string;
	score: number;
	description: string;
	socialLinks: SocialLink[];
	commonDrinks: string[];
};

const CANDIDATES: Candidate[] = [
	{
		name: 'Анна К.',
		fullName: 'Анна Константинова',
		initials: 'АК',
		score: 94,
		description: 'Обожаю эспрессо по утрам и мягкий капучино в обед. Считаю, что хороший кофе — это целая философия.',
		socialLinks: [
			{ id: 1, label: 't.me/anna_kof', url: 'https://t.me/anna_kof' },
			{ id: 2, label: 'instagram.com/anna_k', url: 'https://instagram.com/anna_k' },
		],
		commonDrinks: ['Эспрессо', 'Капучино', 'Флэт уайт'],
	},
	{
		name: 'Михаил Т.',
		fullName: 'Михаил Тарасов',
		initials: 'МТ',
		score: 87,
		description: 'Холодный брю летом и пуэр зимой. Ищу людей, которые разбираются в зерне не хуже меня.',
		socialLinks: [
			{ id: 1, label: 't.me/misha_brew', url: 'https://t.me/misha_brew' },
		],
		commonDrinks: ['Холодный брю', 'Американо'],
	},
	{
		name: 'Елена В.',
		fullName: 'Елена Воронова',
		initials: 'ЕВ',
		score: 91,
		description: 'Бариста с 5-летним стажем. Люблю экспериментировать с авторскими напитками на основе латте.',
		socialLinks: [
			{ id: 1, label: 't.me/lena_barista', url: 'https://t.me/lena_barista' },
			{ id: 2, label: 'vk.com/lena_v', url: 'https://vk.com/lena_v' },
		],
		commonDrinks: ['Латте', 'Раф', 'Капучино'],
	},
	{
		name: 'Дмитрий С.',
		fullName: 'Дмитрий Смирнов',
		initials: 'ДС',
		score: 78,
		description: 'Предпочитаю крепкий чёрный кофе без сахара. Слежу за третьей волной кофейной культуры.',
		socialLinks: [
			{ id: 1, label: 'instagram.com/dmitry_s', url: 'https://instagram.com/dmitry_s' },
		],
		commonDrinks: ['Американо', 'Эспрессо'],
	},
	{
		name: 'Ольга П.',
		fullName: 'Ольга Петрова',
		initials: 'ОП',
		score: 85,
		description: 'Кофейный блогер, путешествую по кофейням мира. Моя страсть — пуровер и кемекс.',
		socialLinks: [
			{ id: 1, label: 't.me/olga_coffee', url: 'https://t.me/olga_coffee' },
			{ id: 2, label: 'instagram.com/olga_p', url: 'https://instagram.com/olga_p' },
			{ id: 3, label: 'vk.com/olga_p', url: 'https://vk.com/olga_p' },
		],
		commonDrinks: ['Пуровер', 'Кемекс', 'Флэт уайт'],
	},
	{
		name: 'Сергей Н.',
		fullName: 'Сергей Никитин',
		initials: 'СН',
		score: 72,
		description: 'Разработчик и кофеман. Работаю только под хороший фильтр-кофе.',
		socialLinks: [
			{ id: 1, label: 'github.com/snikiti', url: 'https://github.com/snikiti' },
		],
		commonDrinks: ['Фильтр-кофе', 'Американо'],
	},
	{
		name: 'Мария Л.',
		fullName: 'Мария Лебедева',
		initials: 'МЛ',
		score: 96,
		description: 'Люблю кофе с молоком и сладкие десерты. Считаю раф лучшим изобретением человечества.',
		socialLinks: [
			{ id: 1, label: 't.me/masha_latte', url: 'https://t.me/masha_latte' },
			{ id: 2, label: 'instagram.com/masha_l', url: 'https://instagram.com/masha_l' },
		],
		commonDrinks: ['Раф', 'Латте', 'Капучино', 'Флэт уайт'],
	},
	{
		name: 'Алексей Ф.',
		fullName: 'Алексей Фролов',
		initials: 'АФ',
		score: 83,
		description: 'Ценю качество зерна и правильную обжарку. Постоянный гость специалти-кофеен.',
		socialLinks: [
			{ id: 1, label: 't.me/alex_specialty', url: 'https://t.me/alex_specialty' },
		],
		commonDrinks: ['Эспрессо', 'Пуровер', 'Холодный брю'],
	},
];

// Duplicated for seamless infinite scroll loop
const DRUM_ITEMS = [...CANDIDATES, ...CANDIDATES];

const ITEM_HEIGHT = 80;
const ITEM_COUNT = CANDIDATES.length; // 8
const DRUM_SCROLL = ITEM_HEIGHT * ITEM_COUNT; // 640px — one full loop
const MAX_VEL = 14; // px/frame at 60fps (~840 px/s)
const ACCEL_FRAMES = 45; // ~750ms to reach full speed

function easeInQuad(t: number): number {
	return t * t;
}

function easeOutQuad(t: number): number {
	return t * (2 - t);
}

// Scroll position that puts targetIndex into the highlighted center slot
function centerPos(targetIndex: number): number {
	return ((targetIndex - 1 + ITEM_COUNT) % ITEM_COUNT) * ITEM_HEIGHT;
}

type MatchModalProps = {
	open: boolean;
	candidate: Candidate;
	onClose: () => void;
};

function MatchModal({ open, candidate, onClose }: MatchModalProps) {
	return (
		<Modal open={open} onCancel={onClose} footer={null} centered={true} width={480}>
			<div className={s.modal}>
				<div className={s.modalHeader}>
					<div className={s.modalAvatar}>{candidate.initials}</div>
					<div className={s.modalMeta}>
						<h3 className={s.modalName}>{candidate.fullName}</h3>
						<span className={s.modalScore}>Совпадение {candidate.score}%</span>
					</div>
				</div>

				{candidate.description && (
					<section className={s.modalSection}>
						<h4 className={s.modalSectionTitle}>О себе</h4>
						<p className={s.modalDescription}>{candidate.description}</p>
					</section>
				)}

				{candidate.commonDrinks.length > 0 && (
					<section className={s.modalSection}>
						<h4 className={s.modalSectionTitle}>Общие напитки</h4>
						<div className={s.modalTags}>
							{candidate.commonDrinks.map((drink) => (
								<Tag key={drink} color="brown">
									{drink}
								</Tag>
							))}
						</div>
					</section>
				)}

				{candidate.socialLinks.length > 0 && (
					<section className={s.modalSection}>
						<h4 className={s.modalSectionTitle}>Социальные сети</h4>
						<ul className={s.modalLinks}>
							{candidate.socialLinks.map((link) => (
								<li key={link.id}>
									<a href={link.url} target="_blank" rel="noopener noreferrer" className={s.modalLink}>
										<span className={s.modalLinkIcon}>🔗</span>
										{link.label}
									</a>
								</li>
							))}
						</ul>
					</section>
				)}
			</div>
		</Modal>
	);
}

const MatchesPage = () => {
	const [state, setState] = useState<SearchState>('idle');
	const [matchIndex, setMatchIndex] = useState(0);
	const [modalOpen, setModalOpen] = useState(false);

	const drumRef = useRef<HTMLDivElement>(null);
	const rafRef = useRef<number>(0);
	const posRef = useRef(0); // current drum scroll position in px
	const velRef = useRef(0); // current velocity in px/frame

	useEffect(() => {
		return () => cancelAnimationFrame(rafRef.current);
	}, []);

	function applyTransform() {
		if (drumRef.current) {
			drumRef.current.style.transform = `translateY(-${posRef.current}px)`;
		}
	}

	function startSpinning() {
		cancelAnimationFrame(rafRef.current);
		let frame = 0;

		function tick() {
			frame++;
			const t = Math.min(frame / ACCEL_FRAMES, 1);
			velRef.current = MAX_VEL * easeInQuad(t);
			posRef.current = (posRef.current + velRef.current) % DRUM_SCROLL;
			applyTransform();
			rafRef.current = requestAnimationFrame(tick);
		}

		rafRef.current = requestAnimationFrame(tick);
	}

	// Decelerates from current velocity to 0, stopping exactly at targetIndex
	function stopAt(targetIndex: number, onDone: () => void) {
		cancelAnimationFrame(rafRef.current);

		const target = centerPos(targetIndex);
		let dist = (target - posRef.current + DRUM_SCROLL) % DRUM_SCROLL;

		// Ensure enough distance for a visible deceleration (≥1.5 full loops)
		while (dist < DRUM_SCROLL * 1.5) dist += DRUM_SCROLL;

		const startPos = posRef.current;

		// easeOutQuad derivative at t=0 is 2, so: initialVel = dist * 2 / T
		// Solve for T: T = 2 * dist / currentVel
		const T = Math.round((2 * dist) / Math.max(velRef.current, MAX_VEL * 0.3));
		let frame = 0;

		function tick() {
			frame++;
			const t = Math.min(frame / T, 1);
			posRef.current = (startPos + dist * easeOutQuad(t)) % DRUM_SCROLL;
			applyTransform();

			if (t >= 1) {
				posRef.current = target;
				applyTransform();
				onDone();
				return;
			}

			rafRef.current = requestAnimationFrame(tick);
		}

		rafRef.current = requestAnimationFrame(tick);
	}

	function handleSearch() {
		setState('searching');
		startSpinning();

		setTimeout(() => {
			const idx = Math.floor(Math.random() * CANDIDATES.length);
			stopAt(idx, () => {
				setMatchIndex(idx);
				setState('found');
			});
		}, 2500);
	}

	function handleReset() {
		cancelAnimationFrame(rafRef.current);
		velRef.current = 0;
		setState('idle');
	}

	const match = CANDIDATES[matchIndex];

	return (
		<div className={s.root}>
			<div className={s.content}>
				<h2 className={s.heading}>Подбор метча</h2>

				<div className={s.roulette}>
					{state === 'idle' && (
						<div className={s.idleContent}>
							<span className={s.idleIcon}>☕</span>
							<span className={s.idleHint}>Найдите своего кофейного близнеца</span>
						</div>
					)}

					{state === 'searching' && (
						<>
							<div ref={drumRef} className={s.drum}>
								{DRUM_ITEMS.map((item, i) => (
									<div key={i} className={s.drumItem}>
										<div className={s.avatar}>{item.initials}</div>
										<span className={s.name}>{item.name}</span>
									</div>
								))}
							</div>
							<div className={s.highlight} />
							<div className={s.fadeTop} />
							<div className={s.fadeBottom} />
						</>
					)}

					{state === 'found' && (
						<button className={s.result} onClick={() => setModalOpen(true)}>
							<div className={s.resultAvatar}>{match.initials}</div>
							<p className={s.resultName}>{match.name}</p>
							<p className={s.resultScore}>Совпадение {match.score}%</p>
							<p className={s.resultHint}>Нажмите, чтобы узнать подробнее</p>
						</button>
					)}
				</div>

				<Button
					type="primary"
					size="large"
					loading={state === 'searching'}
					onClick={state === 'found' ? handleReset : handleSearch}
					className={s.button}
				>
					{state === 'found' ? 'Найти ещё' : 'Найти метч'}
				</Button>
			</div>

			<MatchModal
				open={modalOpen}
				candidate={match}
				onClose={() => setModalOpen(false)}
			/>
		</div>
	);
};

export default MatchesPage;
