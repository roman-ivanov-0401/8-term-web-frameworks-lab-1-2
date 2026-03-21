// Shared TypeScript types between auth-service, main-service and frontend.
// Do NOT import NestJS or any framework-specific code here — pure types only.

// ─── Common ──────────────────────────────────────────────────────────────────

export type Timestamps = {
  created_at: string; // ISO 8601
  modified_at: string;
};

export type Paginated<T> = {
  items: T[];
  total: number;
  page: number;
  per_page: number;
};

export type ApiError = {
  error: { code: string; message: string };
};

// ─── Auth ────────────────────────────────────────────────────────────────────

export type AuthUser = {
  user_id: number;
  user_name: string;
  email: string;
};

export type AuthResponse = {
  token: string;
  refresh_token: string;
  user: AuthUser;
};

export type RegisterDto = {
  user_name: string;
  email: string;
  password: string;
};

export type LoginDto = {
  email: string;
  password: string;
};

// ─── JWT Payload (что кладётся в токен) ─────────────────────────────────────

export type JwtPayload = {
  sub: number;   // user_id
  email: string;
};

// ─── User Profile ─────────────────────────────────────────────────────────────

export type SocialLink = {
  social_link_id: number;
  link: string;
  created_at?: string;
  modified_at?: string;
};

export type MeResponse = AuthUser & {
  user_profile_id: number;
  user_description: string;
  photo_path: string | null;
  social_links: SocialLink[];
};

export type UserProfile = {
  user_profile_id: number;
  user_id: number;
  user_name: string;
  user_description: string;
  photo_path: string | null;
  social_links: SocialLink[];
};

// ─── Drinks ──────────────────────────────────────────────────────────────────

export type Category = {
  category_id: number;
  name: string;
  description?: string;
};

export type Ingredient = {
  ingredient_id: number;
  name: string;
  description: string;
  color: string;
};

export type DrinkIngredient = Ingredient & { percent: number };

export type DrinkListItem = {
  drink_id: number;
  name: string;
  description: string;
  image: string;
  score: number | null;
  isInFavorites: boolean;
  category: Pick<Category, 'category_id' | 'name'>;
};

export type DrinkDetail = {
  drink_id: number;
  name: string;
  description: string;
  category: Category;
  ingredients: DrinkIngredient[];
  user_rating: number | null;
  created_at: string;
  modified_at: string;
};

// ─── Favorites ───────────────────────────────────────────────────────────────

export type FavoriteDrink = {
  drink_id: number;
  name: string;
  description: string;
  category: Pick<Category, 'category_id' | 'name'>;
  rating: number;
  created_at: string;
  modified_at: string;
};

// ─── Matches ─────────────────────────────────────────────────────────────────

export type Match = {
  user_id: number;
  user_name: string;
  photo_path: string | null;
  user_description: string;
  match_score: number;
  common_drinks: Array<{ drink_id: number; name: string }>;
};
