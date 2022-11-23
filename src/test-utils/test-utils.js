import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';

const renderWithRouter = (ui, options) =>
  render(ui, { wrapper: Router, ...options });

export * from '@testing-library/react';

export { renderWithRouter as render };
