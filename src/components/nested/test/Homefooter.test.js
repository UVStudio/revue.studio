import { render, screen } from '../../../test-utils/test-utils';
import userEvent from '@testing-library/user-event';
import HomeFooter from '../HomeFooter';
import About from '../../About';
import { Route, Routes } from 'react-router-dom';

describe('Home footer tests', () => {
  test('Home footer box loads properly', () => {
    render(<HomeFooter />);

    const revue = screen.getByText('Revue');
    expect(revue).toBeVisible();

    const aboutRevue = screen.getByText('About Revue');
    expect(aboutRevue).toBeVisible();

    const betaTester = screen.getByText('Become a beta tester');
    expect(betaTester).toBeVisible();

    const emailUs = screen.getByText('Email us');
    expect(emailUs).toBeVisible();

    const dreamsoft = screen.getByText('Dreamsoft Productions');
    expect(dreamsoft).toBeVisible();
  });

  test('About link navigates to about page', async () => {
    render(
      <Routes>
        <Route path="/" element={<HomeFooter />} />
        <Route path="/About" element={<About />} />
      </Routes>
    );

    const aboutRevue = screen.getByText('About Revue');
    userEvent.click(aboutRevue);

    const aboutText = await screen.findByText(/be one of the first to join/i);
    expect(aboutText).toBeVisible();
  });
});
