import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Col, Empty, Input, Row, Select, Spin } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { catalogModule } from '../../modules/CatalogModule';
import { catalogStore } from '../../models/catalogModel';
import CategoriesSidebar from '../CategoriesSidebar/CategoriesSidebar';
import DrinkCard from '../DrinkCard/DrinkCard';
import s from './CatalogPage.module.scss';

const { Search } = Input;

const CatalogPage = observer(function CatalogPage() {
	const { drinks, categories, ingredientOptions, selectedCategory, selectedIngredients, search, loading } = catalogStore;

	useEffect(() => {
		catalogModule.getCategories();
		catalogModule.getIngredients();
	}, []);

	useEffect(() => {
		catalogModule.getDrinks({
			search: search || undefined,
			categoryIds: selectedCategory !== null ? [selectedCategory] : undefined,
			ingredientIds: selectedIngredients.length > 0 ? selectedIngredients : undefined,
		});
	}, [search, selectedCategory, selectedIngredients]);

	const selectOptions = ingredientOptions.map((i) => ({ label: i.name, value: i.ingredientId }));

	return (
		<div className={s.page}>
			<div className={s.layout}>
				<CategoriesSidebar
					categories={categories}
					selected={selectedCategory}
					onSelect={(id) => catalogStore.setSelectedCategory(id)}
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
								onSearch={(value) => catalogStore.setSearch(value)}
							/>
							<Select
								mode="multiple"
								allowClear={true}
								showSearch={true}
								placeholder="Фильтр по ингредиентам"
								options={selectOptions}
								size="large"
								className={s.select}
								onChange={(ids) => catalogStore.setSelectedIngredients(ids)}
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
				<button className={s.clearBtn} onClick={() => catalogStore.setSelectedCategory(null)}>
					<CloseOutlined />
					Отменить выбор
				</button>
			)}
		</div>
	);
});

export default CatalogPage;
