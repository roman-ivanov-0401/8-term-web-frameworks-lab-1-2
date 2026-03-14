import { useState } from 'react';
import { Col, Input, Rate, Row, Select, Typography } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { handleIngredientFilter, handleSearch } from '../modules/CatalogModule';
import s from './CatalogPage.module.scss';

const { Search } = Input;
const { Text } = Typography;

type Category = {
	id: number;
	name: string;
};

type Drink = {
	id: number;
	name: string;
	image: string;
	rating: number | null;
	categoryId: number;
};

const MOCK_CATEGORIES: Category[] = [
	{ id: 1, name: 'Эспрессо-напитки' },
	{ id: 2, name: 'Молочные напитки' },
	{ id: 3, name: 'Холодные напитки' },
	{ id: 4, name: 'Чайные напитки' },
	{ id: 5, name: 'Авторские напитки' },
];

const MOCK_DRINKS: Drink[] = [
	{ id: 1, name: 'Эспрессо', image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400&q=80', rating: 4, categoryId: 1 },
	{ id: 2, name: 'Капучино', image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&q=80', rating: 5, categoryId: 2 },
	{ id: 3, name: 'Латте', image: 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=400&q=80', rating: null, categoryId: 2 },
	{ id: 4, name: 'Флэт уайт', image: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?w=400&q=80', rating: 3, categoryId: 2 },
	{ id: 5, name: 'Американо', image: 'https://images.unsplash.com/photo-1551030173-122aabc4489c?w=400&q=80', rating: null, categoryId: 1 },
	{ id: 6, name: 'Раф', image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&q=80', rating: 4, categoryId: 5 },
	{ id: 7, name: 'Матча латте', image: 'https://images.unsplash.com/photo-1515823662972-da6a2e4d3002?w=400&q=80', rating: 5, categoryId: 4 },
	{ id: 8, name: 'Холодный брю', image: 'https://images.unsplash.com/photo-1593565512571-df72e4e40cdf?w=400&q=80', rating: null, categoryId: 3 },
];

const INGREDIENT_OPTIONS = [
	'Эспрессо', 'Молоко', 'Ванильный сироп', 'Карамельный сироп',
	'Сливки', 'Корица', 'Шоколад', 'Матча', 'Кокосовое молоко',
	'Миндальное молоко', 'Лёд', 'Карамель',
].map((i) => ({ label: i, value: i }));

type DrinkCardProps = {
	drink: Drink;
};

function DrinkCard({ drink }: DrinkCardProps) {
	return (
		<div className={s.card}>
			<div className={s.imageWrapper}>
				<img src={drink.image} alt={drink.name} className={s.image} />
			</div>
			<div className={s.cardBody}>
				<Text strong={true} className={s.drinkName}>
					{drink.name}
				</Text>
				{drink.rating !== null ? (
					<div className={s.ratingRow}>
						<Rate disabled={true} defaultValue={drink.rating} className={s.rate} />
						<Text className={s.ratingLabel}>{drink.rating} / 5</Text>
					</div>
				) : (
					<Text className={s.notRated}>Не оценено</Text>
				)}
			</div>
		</div>
	);
}

type CategoriesSidebarProps = {
	selected: number | null;
	onSelect: (id: number | null) => void;
};

function CategoriesSidebar({ selected, onSelect }: CategoriesSidebarProps) {
	return (
		<nav className={s.sidebar}>
			<h2 className={s.sidebarTitle}>Категории</h2>
			<ul className={s.categoryList}>
				{MOCK_CATEGORIES.map((cat) => (
					<li key={cat.id}>
						<button
							className={[s.categoryItem, selected === cat.id ? s.categoryItemActive : ''].filter(Boolean).join(' ')}
							onClick={() => onSelect(selected === cat.id ? null : cat.id)}
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
	const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

	const filteredDrinks = selectedCategory !== null
		? MOCK_DRINKS.filter((d) => d.categoryId === selectedCategory)
		: MOCK_DRINKS;

	return (
		<div className={s.page}>
			<div className={s.layout}>
				<CategoriesSidebar selected={selectedCategory} onSelect={setSelectedCategory} />

				<main className={s.main}>
					<div className={s.header}>
						<h1 className={s.title}>Каталог напитков</h1>
						<div className={s.filters}>
							<Search
								placeholder="Поиск напитка..."
								allowClear={true}
								size="large"
								className={s.search}
								onSearch={handleSearch}
							/>
							<Select
								mode="multiple"
								allowClear={true}
								showSearch={true}
								placeholder="Фильтр по ингредиентам"
								options={INGREDIENT_OPTIONS}
								size="large"
								className={s.select}
								onChange={handleIngredientFilter}
								maxTagCount="responsive"
							/>
						</div>
					</div>

					<Row gutter={[20, 20]}>
						{filteredDrinks.map((drink) => (
							<Col key={drink.id} xs={24} sm={12} md={8} lg={6}>
								<DrinkCard drink={drink} />
							</Col>
						))}
					</Row>
				</main>
			</div>

			{selectedCategory !== null && (
				<button className={s.clearBtn} onClick={() => setSelectedCategory(null)}>
					<CloseOutlined />
					Отменить выбор
				</button>
			)}
		</div>
	);
};

export default CatalogPage;
