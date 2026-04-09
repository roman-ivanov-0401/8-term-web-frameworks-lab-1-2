import { axiosInstance } from '@app/shared';

type CommonDrink = {
	drink_id: number;
	name: string;
};

type Match = {
	user_id: number;
	user_name: string;
	photo_path: string | null;
	user_description: string;
	match_score: number;
	common_drinks: CommonDrink[];
};

export const matchesRepository = {
	getMatches: async (): Promise<Match[]> => {
		const { data } = await axiosInstance.get<Match[]>('/matches');
		return data;
	},
};
