import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

export interface ProjectObject {
  id: string;
  userId: string;
  projectName: string;
  projectDescription: string;
  timeStamp: string;
}

export interface ProjectsArray {
  loading: string;
  projects: ProjectObject[];
}

const initialState: ProjectsArray = {
  loading: 'idle',
  projects: [],
};

export const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    projectsLoading: (state) => {
      if (state.loading === 'idle') {
        state.loading = 'loading';
      }
    },
    getProjectsList: (state, action: PayloadAction<ProjectObject[]>) => {
      if (state.loading === 'loading') {
        state.loading = 'idle';
        state.projects = action.payload;
      }
    },
    removeProjectsList: (state) => {
      state.projects = [];
    },
  },
});

export const { getProjectsList, removeProjectsList, projectsLoading } =
  projectsSlice.actions;
export const selectProjects = (state: RootState) => state.projects;

export default projectsSlice.reducer;
