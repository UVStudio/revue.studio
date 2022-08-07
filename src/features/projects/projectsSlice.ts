import {
  createReducer,
  createAction,
  createSlice,
  createAsyncThunk,
  PayloadAction,
  AnyAction,
} from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../app/store';

export interface Project {
  id: string;
  userId: string;
  projectName: string;
  projectDescription: string;
}

export interface ProjectsArray {
  projects: Project[];
}

const initialState: ProjectsArray = {
  projects: [],
};

export const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    getProjectsList: (state, action: PayloadAction<Project[]>) => {
      state.projects = action.payload;
    },
  },
});

export const { getProjectsList } = projectsSlice.actions;
export const selectProjects = (state: RootState) => state.projects;

export default projectsSlice.reducer;
