import { useEffect, useState } from 'react';
import { Col, Empty, Input, Row, Select, Spin } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { catalogModule, type Category, type DrinkListItem, type IngredientOption } from '../../modules/CatalogModule';
import CategoriesSidebar from '../CategoriesSidebar/CategoriesSidebar';
import DrinkCard from '../DrinkCard/DrinkCard';
import s from './CatalogPage.module.scss';

const { Search } = Input;

function CatalogPage() {
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
								<Col key={drink.drinkId} xs={24} sm={12} md={8} lg={6}>
									<DrinkCard drink={drink} />
								</Col>
							))}
						</Row>
					)}
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
}

export default CatalogPage;
