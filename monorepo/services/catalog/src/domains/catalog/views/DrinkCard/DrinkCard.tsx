import { Link } from 'react-router-dom';
import { Typography } from 'antd';
import { type DrinkListItem } from '../../modules/CatalogModule';
import s from './DrinkCard.module.scss';

const { Text } = Typography;

type DrinkCardProps = {
	drink: DrinkListItem;
};

function DrinkCard({ drink }: DrinkCardProps) {
	return (
		<Link to={`/catalog/${drink.drinkId}`} className={s.cardLink}>
			<div className={s.card}>
				<div className={s.imageWrapper}>
					<img src={drink.image} alt={drink.name} className={s.image} />
				</div>
				<div className={s.cardBody}>
					<Text strong={true} className={s.drinkName}>
						{drink.name}
					</Text>
					{drink.score !== null ? (
						<Text className={s.ratingLabel}>Оценка: {drink.score} / 10</Text>
					) : (
						<Text className={s.notRated}>Не оценено</Text>
					)}
				</div>
			</div>
		</Link>
	);
}

export default DrinkCard;
