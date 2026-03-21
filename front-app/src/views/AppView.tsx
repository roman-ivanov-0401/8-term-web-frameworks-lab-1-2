import { type ReactNode, useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import AuthPage from '../domains/auth/views/AuthPage';
import CatalogPage from '../domains/catalog/views/CatalogPage';
import DrinkPage from '../domains/catalog/domains/drink/views/DrinkPage';
import MatchesPage from '../domains/matches/views/MatchesPage';
import ProfilePage from '../domains/profile/views/ProfilePage';
import AppNavbar from './AppNavbar';
import { appModule } from '../modules/appModule';
import { authModule } from '../domains/auth/modules/AuthModule';

function AppNavigator() {
	const navigate = useNavigate();

	useEffect(() => {
		if (appModule.getInitialRoute() !== '/auth') return;
		navigate(appModule.getInitialRoute(), { replace: true });
	}, []);

	return null;
}

function RequireAuth({ children }: { children: ReactNode }) {
	if (!authModule.getToken()) {
		return <Navigate to="/auth" replace />;
	}
	return <>{children}</>;
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
					element={<RequireAuth><MatchesPage /></RequireAuth>}
				/>
				<Route
					path="/catalog"
					element={<RequireAuth><CatalogPage /></RequireAuth>}
				/>
				<Route
					path="/catalog/:id"
					element={<RequireAuth><DrinkPage /></RequireAuth>}
				/>
				<Route
					path="/profile"
					element={<RequireAuth><ProfilePage /></RequireAuth>}
				/>
			</Routes>
		</BrowserRouter>
	);
};

export default AppView;
