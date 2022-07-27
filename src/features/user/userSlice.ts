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

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginUser: (state, action: PayloadAction<UserState>) => {
      state.email = action.payload.email;
      state.token = action.payload.token;
    },
  },
});

export const { loginUser } = userSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectUser = (state: RootState) => state.user;

export default userSlice.reducer;

// const loginUserAction = createAction<UserState>('user/loginUser');

// const userReducer = createReducer(initialState, (builder) => {
//   builder
//     .addCase(loginUserAction, (state, action) => {
//       state = action.payload;
//     })
//     .addDefaultCase((state, action) => {});
// });