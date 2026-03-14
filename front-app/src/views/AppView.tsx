import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AuthPage from '../domains/auth/views/AuthPage';
import CatalogPage from '../domains/catalog/views/CatalogPage';
import DrinkPage from '../domains/catalog/domains/drink/views/DrinkPage';
import MatchesPage from '../domains/matches/views/MatchesPage';
import ProfilePage from '../domains/profile/views/ProfilePage';

const AppView = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/auth" element={<AuthPage />} />
				<Route path="/matches" element={<MatchesPage />} />
				<Route path="/catalog" element={<CatalogPage />} />
				<Route path="/catalog/:id" element={<DrinkPage />} />
				<Route path="/profile" element={<ProfilePage />} />
				<Route path="*" element={<Navigate to="/auth" replace />} />
			</Routes>
		</BrowserRouter>
	);
};

export default AppView;
