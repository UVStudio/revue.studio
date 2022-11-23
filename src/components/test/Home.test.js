import { render, screen } from '../../test-utils/test-utils';
import Home from '../Home';

describe('Home Page loads', () => {
  test('Page title loads with correct texts', () => {
    render(<Home />);
    const title = screen.getByText(
      'Manage all your cloud assets on one platform'
    );
    expect(title).toBeInTheDocument();

    const mainTextSample = screen.getByText(/serious video production/i);
    expect(mainTextSample).toBeInTheDocument();
  });

  test('Video player renders', () => {
    render(<Home />);

    const reactPlayer = screen.getByTestId('react-player');
    expect(reactPlayer).toBeInTheDocument();
  });

  test('Home accordion renders', () => {
    render(<Home />);

    const homeAccordion = screen.getByTestId('home-accordion');
    expect(homeAccordion).toBeInTheDocument();
  });

  test('Home footer renders', () => {
    render(<Home />);

    const homeFooter = screen.getByTestId('home-footer');
    expect(homeFooter).toBeInTheDocument();
  });
});
