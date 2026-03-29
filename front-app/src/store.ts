import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { authApi } from './domains/auth/repositories/authRepository';
import { catalogApi } from './domains/catalog/repositories/catalogRepository';
import { matchesApi } from './domains/matches/repositories/matchesRepository';
import { profileApi } from './domains/profile/repositories/profileRepository';
import currentUserReducer from './models/currentUserModel';
import profileReducer from './domains/profile/models/profileModel';

export const store = configureStore({
	reducer: {
		currentUser: currentUserReducer,
		profile: profileReducer,
		[authApi.reducerPath]: authApi.reducer,
		[catalogApi.reducerPath]: catalogApi.reducer,
		[matchesApi.reducerPath]: matchesApi.reducer,
		[profileApi.reducerPath]: profileApi.reducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredPaths: ['profile.fileList'],
				ignoredActions: ['profile/setFileList'],
			},
		}).concat(authApi.middleware, catalogApi.middleware, matchesApi.middleware, profileApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
