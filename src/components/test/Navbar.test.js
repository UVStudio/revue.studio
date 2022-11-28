import userEvent from '@testing-library/user-event';
import { Routes, Route } from 'react-router-dom';
import { render, screen } from '../../test-utils/test-utils';
import NavBar from '../Navbar';
import Login from '../Login';
import About from '../About';

describe('Navbar tests', () => {
  test('Revue.Studio logo text is loaded.', () => {
    render(<NavBar />);

    const appName = screen.getByText(/- beta/i);
    expect(appName).toBeVisible();
  });

  test('About and login links are loaded.', () => {
    render(<NavBar />);

    const login = screen.getAllByText(/login/i);
    const about = screen.getAllByText(/about/i);
    expect(login).toHaveLength(2);
    expect(about).toHaveLength(3);
  });

  test('Clicking Login goes to login page', async () => {
    render(
      <Routes>
        <Route path="*" element={<NavBar />} />
        <Route path="/Login" element={<Login />} />
      </Routes>
    );

    const login = screen.getAllByText(/login/i);
    userEvent.click(login[0]);
    const loginText = await screen.findByText(/i already have an account/i);
    expect(loginText).toBeVisible();
  });
  test('Clicking About goes to about page', async () => {
    render(
      <Routes>
        <Route path="*" element={<NavBar />} />
        <Route path="/About" element={<About />} />
      </Routes>
    );

    const login = screen.getAllByText(/about/i);
    userEvent.click(login[0]);
    const aboutText = await screen.findByText(/be one of the first to join/i);
    expect(aboutText).toBeVisible();
  });
});
