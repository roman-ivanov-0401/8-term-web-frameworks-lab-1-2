import { makeAutoObservable } from 'mobx';
import type { MatchItem } from '../modules/MatchesModule';

export type SearchState = 'idle' | 'searching' | 'found';

class MatchesStore {
	searchState: SearchState = 'idle';
	matches: MatchItem[] = [];
	matchIndex: number = 0;
	modalOpen: boolean = false;

	constructor() {
		makeAutoObservable(this);
	}

	setSearchState(state: SearchState) {
		this.searchState = state;
	}

	setMatches(matches: MatchItem[]) {
		this.matches = matches;
	}

	setMatchIndex(index: number) {
		this.matchIndex = index;
	}

	setModalOpen(open: boolean) {
		this.modalOpen = open;
	}
}

export const matchesStore = new MatchesStore();
