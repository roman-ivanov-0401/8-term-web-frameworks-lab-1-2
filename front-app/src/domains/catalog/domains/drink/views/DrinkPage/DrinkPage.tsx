import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Rate, Spin } from 'antd';
import { HeartFilled, HeartOutlined } from '@ant-design/icons';
import { useGetDrinkQuery, useToggleFavoriteMutation, useUpdateDrinkRatingMutation } from '../../../../repositories/catalogRepository';
import { useMeQuery } from '../../../../../../domains/auth/repositories/authRepository';
import CoffeeGlass from '../CoffeeGlass/CoffeeGlass';
import IngredientLegend from '../IngredientLegend/IngredientLegend';
import s from './DrinkPage.module.scss';

function DrinkPage() {
	const { id } = useParams<{ id: string }>();
	const drinkId = Number(id);

	const { data: drink } = useGetDrinkQuery(drinkId);
	const { data: me } = useMeQuery();

	const [toggleFavorite] = useToggleFavoriteMutation();
	const [updateDrinkRating] = useUpdateDrinkRatingMutation();

	const [isFavorite, setIsFavorite] = useState(false);
	const [rating, setRating] = useState(0);

	useEffect(() => {
		if (drink) {
			setIsFavorite(drink.isInFavorites);
			setRating(drink.userRating ?? 0);
		}
	}, [drink]);

	async function handleToggleFavorite() {
		if (!me) return;
		const { added } = await toggleFavorite({ userId: me.user_id, drinkId }).unwrap();
		setIsFavorite(added);
		if (added) setRating(0);
	}

	async function handleRatingChange(value: number) {
		if (!me || !isFavorite) return;
		setRating(value);
		await updateDrinkRating({ userId: me.user_id, drinkId, rating: value });
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
					<span className={s.categoryTag}>{drink.category.name}</span>

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
