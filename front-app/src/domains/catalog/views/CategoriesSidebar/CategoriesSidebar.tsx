import { type Category } from '../../modules/CatalogModule';
import s from './CategoriesSidebar.module.scss';

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

export default CategoriesSidebar;
