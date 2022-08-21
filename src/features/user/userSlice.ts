import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

export interface UserState {
  id: string;
  email: string;
  token?: string;
  name?: string;
  city?: string;
  country?: string;
  company?: string;
  description?: string;
  loading?: string;
}

const initialState = {
  id: '',
  email: '',
  token: '',
  name: '',
  city: '',
  country: '',
  company: '',
  description: '',
  loading: 'idle',
} as UserState;

//does createReducer removes the need for 2 different payload calls?
export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    userLoading: (state) => {
      if (state.loading === 'idle') {
        state.loading = 'loading';
      }
    },
    loginUserState: (state, action: PayloadAction<UserState>) => {
      state.id = action.payload.id;
      state.email = action.payload.email;
      state.token = action.payload.token;
    },
    getUserState: (state, action: PayloadAction<UserState>) => {
      if (state.loading === 'loading') {
        state.loading = 'idle';
        state.id = action.payload.id;
        state.email = action.payload.email;
        state.token = action.payload.token;
        state.name = action.payload.name;
        state.city = action.payload.city;
        state.company = action.payload.company;
        state.country = action.payload.country;
        state.description = action.payload.description;
      }
    },

    logoutUserState: (state) => {
      state.id = '';
      state.email = '';
      state.token = '';
      state.name = '';
      state.city = '';
      state.country = '';
      state.company = '';
      state.description = '';
    },
  },
});

export const { loginUserState, logoutUserState, getUserState, userLoading } =
  userSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectUser = (state: RootState) => state.user;

export default userSlice.reducer;
