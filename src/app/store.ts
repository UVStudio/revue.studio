import {
  configureStore,
  combineReducers,
  PreloadedState,
  ThunkAction,
  Action,
} from '@reduxjs/toolkit';
import userReducer from '../features/user/userSlice';
import projectsReducer from '../features/projects/projectsSlice';

const rootReducer = combineReducers({
  user: userReducer,
  projects: projectsReducer,
});

export const store = configureStore({
  reducer: {
    user: userReducer,
    projects: projectsReducer,
  },
});

export function setupStore(preloadedState?: PreloadedState<RootState>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
  });
}

export type RootState = ReturnType<typeof store.getState>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
