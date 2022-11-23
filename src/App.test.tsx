import { act } from '@testing-library/react';
import { App } from './App';

test('renders components of the app', () => {
  act(() => {
    <App />;
  });
});

// test('defines localStorage.getItem', () => {
//   const mockGetItem = jest.fn(localStorage.getItem);
//   expect(mockGetItem).toBeDefined();
// });
