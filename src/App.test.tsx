import React from 'react';
import Home from './components/Home';
import About from './components/About';
import Dashboard from './components/Dashboard';
import Project from './components/Project';
import Login from './components/Login';
import { render, screen } from '@testing-library/react';
import { App } from './App';
import { act } from '@testing-library/react';

// test('renders welcome text', () => {
//   render(<App />);
//   const linkElement = screen.getByText(/Welcome to Revue.Studio/i);
//   expect(linkElement).toBeInTheDocument();
// });

test('renders App', () => {
  render(<App />);
});

test('renders Home', () => {
  render(<Home />);
});

test('renders Dashboard', () => {
  render(<Dashboard />);
});

test('renders About', () => {
  render(<About />);
});

test('renders Login', () => {
  render(<Login />);
});

test('renders Project', () => {
  act(() => {
    <Project />;
  });
});
