import { useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { type DrinkIngredient } from '../../modules/DrinkModule';
import { drinkStore } from '../../models/drinkModel';
import s from './CoffeeGlass.module.scss';

const SVG_W = 200;
const SVG_H = 360;

const LIQ_TOP = 30;
const LIQ_BOTTOM = 334;
const LIQ_H = LIQ_BOTTOM - LIQ_TOP;

const GLASS_CLIP = 'M 30 30 L 170 30 L 156 334 L 44 334 Z';
const GLASS_OUTER = 'M 20 18 L 180 18 L 165 344 L 35 344 Z';

type Layer = DrinkIngredient & { rectY: number; rectH: number };

function computeLayers(ingredients: DrinkIngredient[]): Layer[] {
	let y = LIQ_BOTTOM;
	return [...ingredients].reverse().map((ing) => {
		const h = Math.round((ing.percent / 100) * LIQ_H);
		const rectY = y - h;
		y -= h;
		return { ...ing, rectY, rectH: Math.max(h, 1) };
	});
}

type CoffeeGlassProps = {
	ingredients: DrinkIngredient[];
};

const CoffeeGlass = observer(function CoffeeGlass({ ingredients }: CoffeeGlassProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const { tooltip, hoveredIngredientId } = drinkStore;

	const layers = computeLayers(ingredients);

	function handleSVGMouseMove(e: React.MouseEvent<SVGSVGElement>) {
		const svg = e.currentTarget;
		const container = containerRef.current;
		if (!container) return;

		const svgRect = svg.getBoundingClientRect();
		const svgY = (e.clientY - svgRect.top) * (SVG_H / svgRect.height);

		const hovered = layers.find((l) => svgY >= l.rectY && svgY < l.rectY + l.rectH) ?? null;

		if (!hovered) {
			drinkStore.setTooltip(null);
			drinkStore.setHoveredIngredientId(null);
			return;
		}

		const containerRect = container.getBoundingClientRect();
		drinkStore.setHoveredIngredientId(hovered.ingredient_id);
		drinkStore.setTooltip({
			name: hovered.name,
			percent: hovered.percent,
			x: e.clientX - containerRect.left,
			y: e.clientY - containerRect.top,
		});
	}

	function handleSVGMouseLeave() {
		drinkStore.setTooltip(null);
		drinkStore.setHoveredIngredientId(null);
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

					<linearGradient id="glassShine" x1="0" y1="0" x2="1" y2="0">
						<stop offset="0%" stopColor="white" stopOpacity="0.32" />
						<stop offset="18%" stopColor="white" stopOpacity="0" />
						<stop offset="82%" stopColor="white" stopOpacity="0" />
						<stop offset="100%" stopColor="white" stopOpacity="0.1" />
					</linearGradient>

					<linearGradient id="topShadow" x1="0" y1="0" x2="0" y2="1">
						<stop offset="0%" stopColor="rgba(0,0,0,0.18)" />
						<stop offset="100%" stopColor="rgba(0,0,0,0)" />
					</linearGradient>
				</defs>

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
									hoveredIngredientId === layer.ingredient_id
										? 'brightness(1.2) saturate(1.1)'
										: undefined,
								transition: 'filter 0.12s',
							}}
						/>
					))}

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

					<rect x={0} y={LIQ_TOP} width={SVG_W} height={18} fill="url(#topShadow)" />
					<rect x={0} y={LIQ_TOP} width={SVG_W} height={LIQ_H} fill="url(#glassShine)" />
				</g>

				<path
					d={GLASS_OUTER}
					fill="none"
					stroke="rgba(111, 78, 55, 0.3)"
					strokeWidth="2.5"
					strokeLinejoin="round"
					style={{ pointerEvents: 'none' }}
				/>

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
});

export default CoffeeGlass;
