import { type DrinkIngredient } from '../../modules/DrinkModule';
import s from './IngredientLegend.module.scss';

type IngredientLegendProps = {
	ingredients: DrinkIngredient[];
};

function IngredientLegend({ ingredients }: IngredientLegendProps) {
	return (
		<ul className={s.legend}>
			{ingredients.map((ing) => (
				<li key={ing.ingredient_id} className={s.legendItem}>
					<span className={s.legendDot} style={{ background: ing.color }} />
					<span className={s.legendName}>{ing.name}</span>
					<span className={s.legendPercent}>{ing.percent}%</span>
				</li>
			))}
		</ul>
	);
}

export default IngredientLegend;
