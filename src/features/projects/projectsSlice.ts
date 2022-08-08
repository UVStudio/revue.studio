import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

export interface Project {
  id: string;
  userId: string;
  projectName: string;
  projectDescription: string;
  timeStamp: string;
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
    removeProjectsList: (state) => {
      state.projects = [];
    },
  },
});

export const { getProjectsList, removeProjectsList } = projectsSlice.actions;
export const selectProjects = (state: RootState) => state.projects;

export default projectsSlice.reducer;
