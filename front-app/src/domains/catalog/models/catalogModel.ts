import { makeAutoObservable } from 'mobx';
import type { DrinkListItem, Category, IngredientOption } from '../modules/CatalogModule';

class CatalogStore {
	drinks: DrinkListItem[] = [];
	categories: Category[] = [];
	ingredientOptions: IngredientOption[] = [];
	selectedCategory: number | null = null;
	selectedIngredients: number[] = [];
	search: string = '';
	loading: boolean = false;

	constructor() {
		makeAutoObservable(this);
	}

	setDrinks(drinks: DrinkListItem[]) {
		this.drinks = drinks;
	}

	setCategories(categories: Category[]) {
		this.categories = categories;
	}

	setIngredientOptions(options: IngredientOption[]) {
		this.ingredientOptions = options;
	}

	setSelectedCategory(id: number | null) {
		this.selectedCategory = id;
	}

	setSelectedIngredients(ids: number[]) {
		this.selectedIngredients = ids;
	}

	setSearch(value: string) {
		this.search = value;
	}

	setLoading(value: boolean) {
		this.loading = value;
	}
}

export const catalogStore = new CatalogStore();
