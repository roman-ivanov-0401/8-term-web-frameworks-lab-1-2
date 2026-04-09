import { matchesRepository } from '../repositories/matchesRepository';

export type MatchItem = {
	userId: number;
	userName: string;
	initials: string;
	score: number;
	description: string;
	commonDrinks: string[];
};

function getInitials(name: string): string {
	return name
		.split(' ')
		.map((w) => w[0] ?? '')
		.join('')
		.slice(0, 2)
		.toUpperCase();
}

export const matchesModule = {
	getMatches: async (): Promise<MatchItem[]> => {
		const matches = await matchesRepository.getMatches();
		return matches.map((m) => ({
			userId: m.user_id,
			userName: m.user_name,
			initials: getInitials(m.user_name),
			score: m.match_score,
			description: m.user_description,
			commonDrinks: m.common_drinks.map((d) => d.name),
		}));
	},
};
