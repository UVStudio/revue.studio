import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { ButtonAppBar } from './components/AppBar';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/Welcome to Revue.Studio/i);
  expect(linkElement).toBeInTheDocument();
});

test('renders App', () => {
  render(<App />);
});

test('renders AppBar', () => {
  render(<ButtonAppBar />);
});
