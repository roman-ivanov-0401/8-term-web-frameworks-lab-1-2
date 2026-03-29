import { useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { Button } from 'antd';
import { matchesModule } from '../../modules/MatchesModule';
import { matchesStore } from '../../models/matchesModel';
import MatchModal from '../MatchModal/MatchModal';
import s from './MatchesPage.module.scss';

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

const MatchesPage = observer(function MatchesPage() {
	const { searchState, matches, matchIndex, modalOpen } = matchesStore;

	const drumRef = useRef<HTMLDivElement>(null);
	const rafRef = useRef<number>(0);
	const posRef = useRef(0);
	const velRef = useRef(0);

	useEffect(() => {
		matchesModule.getMatches();
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
		matchesStore.setSearchState('searching');
		startSpinning();

		setTimeout(() => {
			const idx = Math.floor(Math.random() * itemCount);
			stopAt(idx, () => {
				matchesStore.setMatchIndex(idx);
				matchesStore.setSearchState('found');
			});
		}, 2500);
	}

	function handleReset() {
		cancelAnimationFrame(rafRef.current);
		velRef.current = 0;
		matchesStore.setSearchState('idle');
	}

	const match = matches[matchIndex];

	return (
		<div className={s.root}>
			<div className={s.content}>
				<h2 className={s.heading}>Подбор метча</h2>

				<div className={s.roulette}>
					{searchState === 'idle' && (
						<div className={s.idleContent}>
							<span className={s.idleIcon}>☕</span>
							<span className={s.idleHint}>Найдите своего кофейного близнеца</span>
						</div>
					)}

					{searchState === 'searching' && (
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

					{searchState === 'found' && match && (
						<button className={s.result} onClick={() => matchesStore.setModalOpen(true)}>
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
					loading={searchState === 'searching'}
					disabled={matches.length === 0}
					onClick={searchState === 'found' ? handleReset : handleSearch}
					className={s.button}
				>
					{searchState === 'found' ? 'Найти ещё' : 'Найти метч'}
				</Button>
			</div>

			{match && (
				<MatchModal
					open={modalOpen}
					match={match}
					onClose={() => matchesStore.setModalOpen(false)}
				/>
			)}
		</div>
	);
});

export default MatchesPage;
