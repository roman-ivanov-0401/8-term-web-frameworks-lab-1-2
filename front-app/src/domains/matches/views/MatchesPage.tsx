import { useEffect, useRef, useState } from 'react';
import { Button, Modal, Tag } from 'antd';
import { matchesModule, type MatchItem } from '../modules/MatchesModule';
import s from './MatchesPage.module.scss';

type SearchState = 'idle' | 'searching' | 'found';

const ITEM_HEIGHT = 80;
const MAX_VEL = 14;
const ACCEL_FRAMES = 45;

function easeInQuad(t: number): number {
	return t * t;
}

function easeOutQuad(t: number): number {
	return t * (2 - t);
}

function centerPos(targetIndex: number, itemCount: number): number {
	return ((targetIndex - 1 + itemCount) % itemCount) * ITEM_HEIGHT;
}

type MatchModalProps = {
	open: boolean;
	match: MatchItem;
	onClose: () => void;
};

function MatchModal({ open, match, onClose }: MatchModalProps) {
	return (
		<Modal open={open} onCancel={onClose} footer={null} centered={true} width={480}>
			<div className={s.modal}>
				<div className={s.modalHeader}>
					<div className={s.modalAvatar}>{match.initials}</div>
					<div className={s.modalMeta}>
						<h3 className={s.modalName}>{match.userName}</h3>
						<span className={s.modalScore}>Совпадение {match.score}%</span>
					</div>
				</div>

				{match.description && (
					<section className={s.modalSection}>
						<h4 className={s.modalSectionTitle}>О себе</h4>
						<p className={s.modalDescription}>{match.description}</p>
					</section>
				)}

				{match.commonDrinks.length > 0 && (
					<section className={s.modalSection}>
						<h4 className={s.modalSectionTitle}>Общие напитки</h4>
						<div className={s.modalTags}>
							{match.commonDrinks.map((drink) => (
								<Tag key={drink} color="brown">
									{drink}
								</Tag>
							))}
						</div>
					</section>
				)}
			</div>
		</Modal>
	);
}

const MatchesPage = () => {
	const [state, setState] = useState<SearchState>('idle');
	const [matches, setMatches] = useState<MatchItem[]>([]);
	const [matchIndex, setMatchIndex] = useState(0);
	const [modalOpen, setModalOpen] = useState(false);

	const drumRef = useRef<HTMLDivElement>(null);
	const rafRef = useRef<number>(0);
	const posRef = useRef(0);
	const velRef = useRef(0);

	useEffect(() => {
		matchesModule.getMatches().then(setMatches);
		return () => cancelAnimationFrame(rafRef.current);
	}, []);

	const drumItems = [...matches, ...matches];
	const itemCount = matches.length;
	const drumScroll = ITEM_HEIGHT * itemCount;

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
			posRef.current = (posRef.current + velRef.current) % drumScroll;
			applyTransform();
			rafRef.current = requestAnimationFrame(tick);
		}

		rafRef.current = requestAnimationFrame(tick);
	}

	function stopAt(targetIndex: number, onDone: () => void) {
		cancelAnimationFrame(rafRef.current);

		const target = centerPos(targetIndex, itemCount);
		let dist = (target - posRef.current + drumScroll) % drumScroll;

		while (dist < drumScroll * 1.5) dist += drumScroll;

		const startPos = posRef.current;
		const T = Math.round((2 * dist) / Math.max(velRef.current, MAX_VEL * 0.3));
		let frame = 0;

		function tick() {
			frame++;
			const t = Math.min(frame / T, 1);
			posRef.current = (startPos + dist * easeOutQuad(t)) % drumScroll;
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
			const idx = Math.floor(Math.random() * itemCount);
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

	const match = matches[matchIndex];

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
								{drumItems.map((item, i) => (
									<div key={i} className={s.drumItem}>
										<div className={s.avatar}>{item.initials}</div>
										<span className={s.name}>{item.userName}</span>
									</div>
								))}
							</div>
							<div className={s.highlight} />
							<div className={s.fadeTop} />
							<div className={s.fadeBottom} />
						</>
					)}

					{state === 'found' && match && (
						<button className={s.result} onClick={() => setModalOpen(true)}>
							<div className={s.resultAvatar}>{match.initials}</div>
							<p className={s.resultName}>{match.userName}</p>
							<p className={s.resultScore}>Совпадение {match.score}%</p>
							<p className={s.resultHint}>Нажмите, чтобы узнать подробнее</p>
						</button>
					)}
				</div>

				<Button
					type="primary"
					size="large"
					loading={state === 'searching'}
					disabled={matches.length === 0}
					onClick={state === 'found' ? handleReset : handleSearch}
					className={s.button}
				>
					{state === 'found' ? 'Найти ещё' : 'Найти метч'}
				</Button>
			</div>

			{match && (
				<MatchModal
					open={modalOpen}
					match={match}
					onClose={() => setModalOpen(false)}
				/>
			)}
		</div>
	);
};

export default MatchesPage;
