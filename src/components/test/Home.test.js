import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Home from '../Home';

describe('Home Page loads', () => {
  test('Page title loads with correct texts', () => {
    render(
      <Router>
        <Home />
      </Router>
    );
    const title = screen.getByText(
      'Manage all your cloud assets on one platform'
    );
    expect(title).toBeTruthy();

    const mainTextSample = screen.getByText(/serious video production/i);
    expect(mainTextSample).toBeTruthy();
  });

  test('Video player renders', () => {
    render(
      <Router>
        <Home />
      </Router>
    );

    const reactPlayer = screen.getByTestId('react-player');
    expect(reactPlayer).toBeTruthy();
  });

  test('Home accordion renders', () => {
    render(
      <Router>
        <Home />
      </Router>
    );

    const homeAccordion = screen.getByTestId('home-accordion');
    expect(homeAccordion).toBeTruthy();
  });

  test('Home afooter renders', () => {
    render(
      <Router>
        <Home />
      </Router>
    );

    const homeFooter = screen.getByTestId('home-footer');
    expect(homeFooter).toBeTruthy();
  });
});
