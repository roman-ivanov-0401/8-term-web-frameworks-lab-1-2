import { useState } from 'react';
import { Col, Empty, Input, Row, Select, Spin } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { type Category, type DrinkListItem } from '../../modules/CatalogModule';
import { useGetCategoriesQuery, useGetDrinksQuery, useGetIngredientsQuery } from '../../repositories/catalogRepository';
import CategoriesSidebar from '../CategoriesSidebar/CategoriesSidebar';
import DrinkCard from '../DrinkCard/DrinkCard';
import s from './CatalogPage.module.scss';

export type { Category, DrinkListItem };

const { Search } = Input;

function CatalogPage() {
	const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
	const [selectedIngredients, setSelectedIngredients] = useState<number[]>([]);
	const [search, setSearch] = useState('');

	const { data: categories = [] } = useGetCategoriesQuery();
	const { data: ingredientOptions = [] } = useGetIngredientsQuery();
	const { data: drinks = [], isFetching } = useGetDrinksQuery({
		search: search || undefined,
		categoryIds: selectedCategory !== null ? [selectedCategory] : undefined,
		ingredientIds: selectedIngredients.length > 0 ? selectedIngredients : undefined,
	});

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

					{isFetching ? (
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
