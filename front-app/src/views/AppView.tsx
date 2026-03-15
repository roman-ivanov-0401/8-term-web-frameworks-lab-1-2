import { useEffect } from 'react';
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import AuthPage from '../domains/auth/views/AuthPage';
import CatalogPage from '../domains/catalog/views/CatalogPage';
import DrinkPage from '../domains/catalog/domains/drink/views/DrinkPage';
import MatchesPage from '../domains/matches/views/MatchesPage';
import ProfilePage from '../domains/profile/views/ProfilePage';
import AppNavbar from './AppNavbar';
import { appModule } from '../modules/appModule';

function AppNavigator() {
	const navigate = useNavigate();

	useEffect(() => {
		if (appModule.getInitialRoute() !== '/auth') return;
		navigate(appModule.getInitialRoute(), { replace: true });
	}, []);

	return null;
}

const AppView = () => {
	return (
		<BrowserRouter>
			<AppNavigator />
			<AppNavbar />
			<Routes>
				<Route
					path="/auth"
					element={<AuthPage />}
				/>
				<Route
					path="/matches"
					element={<MatchesPage />}
				/>
				<Route
					path="/catalog"
					element={<CatalogPage />}
				/>
				<Route
					path="/catalog/:id"
					element={<DrinkPage />}
				/>
				<Route
					path="/profile"
					element={<ProfilePage />}
				/>
			</Routes>
		</BrowserRouter>
	);
};

export default AppView;
