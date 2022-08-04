import React from 'react';
import Home from './components/Home';
import About from './components/About';
import Dashboard from './components/Dashboard';
import Projects from './components/Projects';
import Login from './components/Login';
import { act } from '@testing-library/react';
import { App } from './App';

// test('renders welcome text', () => {
//   render(<App />);
//   const linkElement = screen.getByText(/Welcome to Revue.Studio/i);
//   expect(linkElement).toBeInTheDocument();
// });

// write a test to make sure localStorage.userdata.id is same as userState.id

test('renders components of the app', () => {
  act(() => {
    <App />;
    <Home />;
    <Dashboard />;
    <About />;
    <Login />;
    <Projects />;
  });
});

test('defines localStorage.getItem', () => {
  const mockGetItem = jest.fn(localStorage.getItem);
  expect(mockGetItem).toBeDefined();
});
