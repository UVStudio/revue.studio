import React from 'react';
// import Home from './components/Home';
// import About from './components/About';
// import Dashboard from './components/Dashboard';
// import Projects from './components/Project';
// import Login from './components/Login';
// import AddProjects from './components/nested/AddProject';
import { act } from '@testing-library/react';
import { App } from './App';

test('renders components of the app', () => {
  act(() => {
    <App />;
    // <Home />;
    // <Dashboard />;
    // <About />;
    // <Login />;
    // <Projects />;
    // <AddProjects />;
  });
});

// test('defines localStorage.getItem', () => {
//   const mockGetItem = jest.fn(localStorage.getItem);
//   expect(mockGetItem).toBeDefined();
// });
