import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Col, Empty, Input, Rate, Row, Select, Spin, Typography } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { catalogModule, type Category, type DrinkListItem, type IngredientOption } from '../modules/CatalogModule';
import s from './CatalogPage.module.scss';

const { Search } = Input;
const { Text } = Typography;

type DrinkCardProps = {
	drink: DrinkListItem;
};

function DrinkCard({ drink }: DrinkCardProps) {
	return (
		<Link
			to={`/catalog/${drink.drinkId}`}
			className={s.cardLink}
		>
			<div className={s.card}>
				<div className={s.imageWrapper}>
					<img
						src={drink.image}
						alt={drink.name}
						className={s.image}
					/>
				</div>
				<div className={s.cardBody}>
					<Text
						strong={true}
						className={s.drinkName}
					>
						{drink.name}
					</Text>
					{drink.score !== null ? (
						<div className={s.ratingRow}>
							<Rate
								disabled={true}
								defaultValue={drink.score}
								className={s.rate}
							/>
							<Text className={s.ratingLabel}>{drink.score} / 5</Text>
						</div>
					) : (
						<Text className={s.notRated}>Не оценено</Text>
					)}
				</div>
			</div>
		</Link>
	);
}

type CategoriesSidebarProps = {
	categories: Category[];
	selected: number | null;
	onSelect: (id: number | null) => void;
};

function CategoriesSidebar({ categories, selected, onSelect }: CategoriesSidebarProps) {
	return (
		<nav className={s.sidebar}>
			<h2 className={s.sidebarTitle}>Категории</h2>
			<ul className={s.categoryList}>
				{categories.map((cat) => (
					<li key={cat.categoryId}>
						<button
							className={[s.categoryItem, selected === cat.categoryId ? s.categoryItemActive : '']
								.filter(Boolean)
								.join(' ')}
							onClick={() => onSelect(selected === cat.categoryId ? null : cat.categoryId)}
						>
							{cat.name}
						</button>
					</li>
				))}
			</ul>
		</nav>
	);
}

const CatalogPage = () => {
	const [drinks, setDrinks] = useState<DrinkListItem[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);
	const [ingredientOptions, setIngredientOptions] = useState<IngredientOption[]>([]);
	const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
	const [selectedIngredients, setSelectedIngredients] = useState<number[]>([]);
	const [search, setSearch] = useState('');
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		catalogModule.getCategories().then(setCategories);
		catalogModule.getIngredients().then(setIngredientOptions);
	}, []);

	useEffect(() => {
		setLoading(true);
		catalogModule
			.getDrinks({
				search: search || undefined,
				categoryIds: selectedCategory !== null ? [selectedCategory] : undefined,
				ingredientIds: selectedIngredients.length > 0 ? selectedIngredients : undefined,
			})
			.then(setDrinks)
			.finally(() => setLoading(false));
	}, [search, selectedCategory, selectedIngredients]);

	const selectOptions = ingredientOptions.map((i) => ({ label: i.name, value: i.ingredientId }));

	return (
		<div className={s.page}>
			<div className={s.layout}>
				<CategoriesSidebar
					categories={categories}
					selected={selectedCategory}
					onSelect={setSelectedCategory}
				/>

				<main className={s.main}>
					<div className={s.header}>
						<h1 className={s.title}>Каталог напитков</h1>
						<div className={s.filters}>
							<Search
								placeholder="Поиск напитка..."
								allowClear={true}
								size="large"
								className={s.search}
								onSearch={setSearch}
							/>
							<Select
								mode="multiple"
								allowClear={true}
								showSearch={true}
								placeholder="Фильтр по ингредиентам"
								options={selectOptions}
								size="large"
								className={s.select}
								onChange={setSelectedIngredients}
								maxTagCount="responsive"
							/>
						</div>
					</div>

					{loading ? (
						<div className={s.centered}>
							<Spin size="large" />
						</div>
					) : drinks.length === 0 ? (
						<div className={s.centered}>
							<Empty description="Напитки не найдены" />
						</div>
					) : (
						<Row gutter={[20, 20]}>
							{drinks.map((drink) => (
								<Col
									key={drink.drinkId}
									xs={24}
									sm={12}
									md={8}
									lg={6}
								>
									<DrinkCard drink={drink} />
								</Col>
							))}
						</Row>
					)}
				</main>
			</div>

			{selectedCategory !== null && (
				<button
					className={s.clearBtn}
					onClick={() => setSelectedCategory(null)}
				>
					<CloseOutlined />
					Отменить выбор
				</button>
			)}
		</div>
	);
};

export default CatalogPage;
