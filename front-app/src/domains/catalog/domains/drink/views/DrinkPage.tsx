import { useRef, useState } from 'react';
import { Button, Rate, Tag } from 'antd';
import { HeartFilled, HeartOutlined } from '@ant-design/icons';
import s from './DrinkPage.module.scss';

type Ingredient = {
	ingredient_id: number;
	name: string;
	color: string;
	percent: number;
	description: string;
};

type Drink = {
	drink_id: number;
	name: string;
	description: string;
	category: { category_id: number; name: string };
	ingredients: Ingredient[];
	user_rating: number | null;
	isInFavorites: boolean;
};

// Ingredients ordered top → bottom in the glass
const MOCK_DRINK: Drink = {
	drink_id: 1,
	name: 'Капучино',
	description:
		'Классический итальянский кофейный напиток, приготовленный из двойного эспрессо и вспененного молока. Нежная молочная пенка и насыщенный кофейный вкус создают идеальный баланс. Принято подавать в керамической чашке объёмом 150–180 мл.',
	category: { category_id: 2, name: 'Молочные напитки' },
	ingredients: [
		{ ingredient_id: 3, name: 'Молочная пена', color: '#FFF0DC', percent: 33, description: '' },
		{ ingredient_id: 2, name: 'Вспененное молоко', color: '#D4A96A', percent: 34, description: '' },
		{ ingredient_id: 1, name: 'Эспрессо', color: '#2C1204', percent: 33, description: '' },
	],
	user_rating: null,
	isInFavorites: false,
};

// ─── Glass SVG constants ──────────────────────────────────────────────────────

const SVG_W = 200;
const SVG_H = 360;

// Liquid area boundaries inside the glass shape
const LIQ_TOP = 30;
const LIQ_BOTTOM = 334;
const LIQ_H = LIQ_BOTTOM - LIQ_TOP; // 304 px

// Clip path matching the glass interior (trapezoid)
const GLASS_CLIP = 'M 30 30 L 170 30 L 156 334 L 44 334 Z';
// Glass outer border path (slightly outside the clip)
const GLASS_OUTER = 'M 20 18 L 180 18 L 165 344 L 35 344 Z';

// ─── Layer geometry ───────────────────────────────────────────────────────────

type Layer = Ingredient & { rectY: number; rectH: number };

function computeLayers(ingredients: Ingredient[]): Layer[] {
	let y = LIQ_BOTTOM;
	// Fill from bottom upward → process ingredients in reverse (last = bottom)
	return [...ingredients].reverse().map((ing) => {
		const h = Math.round((ing.percent / 100) * LIQ_H);
		const rectY = y - h;
		y -= h;
		return { ...ing, rectY, rectH: Math.max(h, 1) };
	});
}

// ─── Coffee glass SVG component ───────────────────────────────────────────────

type TooltipInfo = { name: string; percent: number; x: number; y: number };

type CoffeeGlassProps = { ingredients: Ingredient[] };

function CoffeeGlass({ ingredients }: CoffeeGlassProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const [tooltip, setTooltip] = useState<TooltipInfo | null>(null);
	const [hoveredId, setHoveredId] = useState<number | null>(null);

	const layers = computeLayers(ingredients);

	// One handler on the <svg> element.
	// Converts screen coords → SVG coordinate space, finds the hovered layer by Y.
	// Positions the tooltip in CSS px relative to .glassContainer.
	function handleSVGMouseMove(e: React.MouseEvent<SVGSVGElement>) {
		const svg = e.currentTarget;
		const container = containerRef.current;
		if (!container) return;

		const svgRect = svg.getBoundingClientRect();
		// Y position in SVG user-unit space
		const svgY = (e.clientY - svgRect.top) * (SVG_H / svgRect.height);

		const hovered = layers.find((l) => svgY >= l.rectY && svgY < l.rectY + l.rectH) ?? null;

		if (!hovered) {
			setTooltip(null);
			setHoveredId(null);
			return;
		}

		const containerRect = container.getBoundingClientRect();
		setHoveredId(hovered.ingredient_id);
		setTooltip({
			name: hovered.name,
			percent: hovered.percent,
			// tooltip in CSS px relative to the container
			x: e.clientX - containerRect.left,
			y: e.clientY - containerRect.top,
		});
	}

	function handleSVGMouseLeave() {
		setTooltip(null);
		setHoveredId(null);
	}

	return (
		<div className={s.glassContainer} ref={containerRef}>
			<svg
				viewBox={`0 0 ${SVG_W} ${SVG_H}`}
				className={s.glass}
				style={{ cursor: 'crosshair' }}
				onMouseMove={handleSVGMouseMove}
				onMouseLeave={handleSVGMouseLeave}
			>
				<defs>
					<clipPath id="glassClip">
						<path d={GLASS_CLIP} />
					</clipPath>

					{/* Left-edge glass shine */}
					<linearGradient id="glassShine" x1="0" y1="0" x2="1" y2="0">
						<stop offset="0%" stopColor="white" stopOpacity="0.32" />
						<stop offset="18%" stopColor="white" stopOpacity="0" />
						<stop offset="82%" stopColor="white" stopOpacity="0" />
						<stop offset="100%" stopColor="white" stopOpacity="0.1" />
					</linearGradient>

					{/* Subtle inner shadow at top of liquid */}
					<linearGradient id="topShadow" x1="0" y1="0" x2="0" y2="1">
						<stop offset="0%" stopColor="rgba(0,0,0,0.18)" />
						<stop offset="100%" stopColor="rgba(0,0,0,0)" />
					</linearGradient>
				</defs>

				{/* All children inside <g> have no individual pointer events —
				    the <svg> captures everything via onMouseMove above */}
				<g clipPath="url(#glassClip)" style={{ pointerEvents: 'none' }}>
					{layers.map((layer) => (
						<rect
							key={layer.ingredient_id}
							x={0}
							y={layer.rectY}
							width={SVG_W}
							height={layer.rectH}
							fill={layer.color}
							style={{
								filter:
									hoveredId === layer.ingredient_id
										? 'brightness(1.2) saturate(1.1)'
										: undefined,
								transition: 'filter 0.12s',
							}}
						/>
					))}

					{/* Thin separator lines between layers */}
					{layers.slice(1).map((layer) => (
						<line
							key={`sep-${layer.ingredient_id}`}
							x1={0}
							y1={layer.rectY + layer.rectH}
							x2={SVG_W}
							y2={layer.rectY + layer.rectH}
							stroke="rgba(0,0,0,0.08)"
							strokeWidth="1"
						/>
					))}

					{/* Top liquid shadow */}
					<rect x={0} y={LIQ_TOP} width={SVG_W} height={18} fill="url(#topShadow)" />

					{/* Glass shine overlay */}
					<rect x={0} y={LIQ_TOP} width={SVG_W} height={LIQ_H} fill="url(#glassShine)" />
				</g>

				{/* Glass outer border */}
				<path
					d={GLASS_OUTER}
					fill="none"
					stroke="rgba(111, 78, 55, 0.3)"
					strokeWidth="2.5"
					strokeLinejoin="round"
					style={{ pointerEvents: 'none' }}
				/>

				{/* Top rim */}
				<rect
					x={16}
					y={12}
					width={168}
					height={11}
					rx={5.5}
					fill="rgba(111, 78, 55, 0.15)"
					stroke="rgba(111, 78, 55, 0.3)"
					strokeWidth="1.5"
					style={{ pointerEvents: 'none' }}
				/>
			</svg>

			{tooltip && (
				<div
					className={s.tooltip}
					style={{ left: tooltip.x + 16, top: tooltip.y - 40 }}
				>
					<span className={s.tooltipName}>{tooltip.name}</span>
					<span className={s.tooltipPercent}>{tooltip.percent}%</span>
				</div>
			)}
		</div>
	);
}

// ─── Ingredient legend ────────────────────────────────────────────────────────

function IngredientLegend({ ingredients }: { ingredients: Ingredient[] }) {
	return (
		<ul className={s.legend}>
			{ingredients.map((ing) => (
				<li key={ing.ingredient_id} className={s.legendItem}>
					<span
						className={s.legendDot}
						style={{ background: ing.color }}
					/>
					<span className={s.legendName}>{ing.name}</span>
					<span className={s.legendPercent}>{ing.percent}%</span>
				</li>
			))}
		</ul>
	);
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const DrinkPage = () => {
	const drink = MOCK_DRINK;

	const [isFavorite, setIsFavorite] = useState(drink.isInFavorites);
	const [rating, setRating] = useState<number>(drink.user_rating ?? 0);

	return (
		<div className={s.page}>
			<div className={s.layout}>
				{/* Left: glass visualization */}
				<div className={s.leftPanel}>
					<CoffeeGlass ingredients={drink.ingredients} />
					<IngredientLegend ingredients={drink.ingredients} />
				</div>

				{/* Right: drink info */}
				<div className={s.rightPanel}>
					<Tag color="brown" className={s.categoryTag}>
						{drink.category.name}
					</Tag>

					<h1 className={s.drinkName}>{drink.name}</h1>
					<p className={s.description}>{drink.description}</p>

					<div className={s.divider} />

					<div className={s.ratingSection}>
						<span className={s.ratingLabel}>Ваша оценка</span>
						<div className={s.ratingRow}>
							<Rate
								count={10}
								value={rating}
								onChange={setRating}
								allowHalf={false}
								allowClear={true}
								className={s.rate}
							/>
							<span className={s.ratingValue}>
								{rating > 0 ? `${rating} / 10` : 'Не оценено'}
							</span>
						</div>
					</div>

					<Button
						type={isFavorite ? 'primary' : 'default'}
						size="large"
						icon={isFavorite ? <HeartFilled /> : <HeartOutlined />}
						onClick={() => setIsFavorite((f) => !f)}
						className={s.favoriteBtn}
					>
						{isFavorite ? 'В избранном' : 'Добавить в избранное'}
					</Button>
				</div>
			</div>
		</div>
	);
};

export default DrinkPage;
