import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Rate, Spin, Tag } from 'antd';
import { HeartFilled, HeartOutlined } from '@ant-design/icons';
import { drinkModule, type DrinkDetail } from '../../modules/DrinkModule';
import CoffeeGlass from '../CoffeeGlass/CoffeeGlass';
import IngredientLegend from '../IngredientLegend/IngredientLegend';
import s from './DrinkPage.module.scss';

function DrinkPage() {
	const { id } = useParams<{ id: string }>();
	const [drink, setDrink] = useState<DrinkDetail | null>(null);
	const [isFavorite, setIsFavorite] = useState(false);
	const [rating, setRating] = useState(0);

	useEffect(() => {
		if (!id) return;
		drinkModule.getDrink(Number(id)).then((d) => {
			setDrink(d);
			setIsFavorite(d.isInFavorites);
			setRating(d.userRating ?? 0);
		});
	}, [id]);

	async function handleToggleFavorite() {
		if (!drink) return;
		const { isFavorite: newFavorite, rating: newRating } = await drinkModule.toggleFavorite(drink.drinkId);
		setIsFavorite(newFavorite);
		setRating(newRating);
	}

	async function handleRatingChange(value: number) {
		if (!drink || !isFavorite) return;
		setRating(value);
		await drinkModule.updateRating(drink.drinkId, value);
	}

	if (!drink) {
		return (
			<div className={s.page}>
				<Spin size="large" />
			</div>
		);
	}

	return (
		<div className={s.page}>
			<div className={s.layout}>
				<div className={s.leftPanel}>
					<CoffeeGlass ingredients={drink.ingredients} />
					<IngredientLegend ingredients={drink.ingredients} />
				</div>

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
								onChange={handleRatingChange}
								allowHalf={false}
								allowClear={true}
								disabled={!isFavorite}
								className={s.rate}
							/>
							<span className={s.ratingValue}>
								{!isFavorite
									? 'Добавьте в избранное'
									: rating > 0
										? `${rating} / 10`
										: 'Не оценено'}
							</span>
						</div>
					</div>

					<Button
						type={isFavorite ? 'primary' : 'default'}
						size="large"
						icon={isFavorite ? <HeartFilled /> : <HeartOutlined />}
						onClick={handleToggleFavorite}
						className={s.favoriteBtn}
					>
						{isFavorite ? 'В избранном' : 'Добавить в избранное'}
					</Button>
				</div>
			</div>
		</div>
	);
}

export default DrinkPage;
