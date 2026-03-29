import { makeAutoObservable } from 'mobx';
import type { DrinkDetail } from '../modules/DrinkModule';

export type TooltipInfo = { name: string; percent: number; x: number; y: number };

class DrinkStore {
	drink: DrinkDetail | null = null;
	isFavorite: boolean = false;
	rating: number = 0;
	tooltip: TooltipInfo | null = null;
	hoveredIngredientId: number | null = null;

	constructor() {
		makeAutoObservable(this);
	}

	setDrink(drink: DrinkDetail | null) {
		this.drink = drink;
	}

	setIsFavorite(value: boolean) {
		this.isFavorite = value;
	}

	setRating(value: number) {
		this.rating = value;
	}

	setTooltip(tooltip: TooltipInfo | null) {
		this.tooltip = tooltip;
	}

	setHoveredIngredientId(id: number | null) {
		this.hoveredIngredientId = id;
	}
}

export const drinkStore = new DrinkStore();
