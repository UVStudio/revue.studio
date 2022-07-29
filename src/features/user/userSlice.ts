import {
  createReducer,
  createAction,
  createSlice,
  createAsyncThunk,
  PayloadAction,
  AnyAction,
} from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../app/store';

interface UserState {
  email: string;
  token: string;
}

const initialState = {
  email: '',
  token: '',
} as UserState;

//does createReducer removes the need for 2 different payload calls?
export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginUserState: (state, action: PayloadAction<UserState>) => {
      state.email = action.payload.email;
      state.token = action.payload.token;
    },
    logoutUserState: (state) => {
      state.email = '';
      state.token = '';
    },
    // getUserState: (state, action: PayloadAction<UserState>) => {
    //   state.email = action.payload.email;
    //   state.token = action.payload.token;
    // },
  },
});

export const { loginUserState, logoutUserState } = userSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectUser = (state: RootState) => state.user;

export default userSlice.reducer;
