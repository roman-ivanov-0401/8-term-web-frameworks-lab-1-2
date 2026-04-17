import { lazy, Suspense, type ReactNode, useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { Spin } from 'antd';
import { authModule } from '@app/shared';
import AuthPage from '../domains/auth/views/AuthPage/AuthPage';
import ProfilePage from '../domains/profile/views/ProfilePage/ProfilePage';
import AppNavbar from './AppNavbar';
import { appModule } from '../modules/appModule';
import RemoteErrorBoundary from './RemoteErrorBoundary';

const CatalogPage = lazy(() => import('catalog/CatalogPage'));
const DrinkPage = lazy(() => import('catalog/DrinkPage'));
const MatchesPage = lazy(() => import('matches/MatchesPage'));

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
		return <Navigate to="/auth" replace={true} />;
	}
	return <>{children}</>;
}

function RemoteFallback() {
	return (
		<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 64 }}>
			<Spin size="large" />
		</div>
	);
}

function RemoteRoute({
	serviceName,
	children,
}: {
	serviceName: string;
	children: ReactNode;
}) {
	return (
		<RemoteErrorBoundary serviceName={serviceName}>
			<RequireAuth>{children}</RequireAuth>
		</RemoteErrorBoundary>
	);
}

const AppView = () => {
	return (
		<BrowserRouter>
			<AppNavigator />
			<AppNavbar />
			<Suspense fallback={<RemoteFallback />}>
				<Routes>
					<Route
						path="/auth"
						element={<AuthPage />}
					/>
					<Route
						path="/matches"
						element={<RemoteRoute serviceName="Матчи"><MatchesPage /></RemoteRoute>}
					/>
					<Route
						path="/catalog"
						element={<RemoteRoute serviceName="Каталог"><CatalogPage /></RemoteRoute>}
					/>
					<Route
						path="/catalog/:id"
						element={<RemoteRoute serviceName="Каталог"><DrinkPage /></RemoteRoute>}
					/>
					<Route
						path="/profile"
						element={<RequireAuth><ProfilePage /></RequireAuth>}
					/>
				</Routes>
			</Suspense>
		</BrowserRouter>
	);
};

export default AppView;
