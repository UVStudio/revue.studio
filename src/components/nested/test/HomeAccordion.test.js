import { render, screen } from '../../../test-utils/test-utils';
import userEvent from '@testing-library/user-event';
import HomeAccordion from '../HomeAccordion';

describe('Home accordion works properly', () => {
  test('Accordion box is loaded', () => {
    render(<HomeAccordion />);

    const accordionBox = screen.getByTestId('accordion-box');
    expect(accordionBox).toBeInTheDocument();
  });

  test('UseState hook to expand accordion works', () => {
    render(<HomeAccordion />);

    const panelOne = screen.getByTestId('accordion-question1');
    expect(panelOne).toBeInTheDocument();

    const panelTwo = screen.getByTestId('accordion-question2');
    expect(panelTwo).toBeInTheDocument();

    const panelThree = screen.getByTestId('accordion-question3');
    expect(panelThree).toBeInTheDocument();

    const panelFour = screen.getByTestId('accordion-question4');
    expect(panelFour).toBeInTheDocument();

    const answerOne = screen.getByText(
      /made especially for video production studios/i
    );
    expect(answerOne).not.toBeVisible();

    userEvent.click(panelOne);
    expect(answerOne).toBeVisible();

    const answerTwo = screen.getByText(
      /many core functionalities similar services/i
    );
    expect(answerTwo).not.toBeVisible();

    userEvent.click(panelTwo);
    expect(answerTwo).toBeVisible();

    const answerThree = screen.getByText(
      /Soon! We are working on this as good and as quickly we can/i
    );
    expect(answerThree).not.toBeVisible();

    userEvent.click(panelThree);
    expect(answerThree).toBeVisible();

    const answerFour = screen.getByText(
      /Our goal is to make life easier for video professionals/i
    );
    expect(answerFour).not.toBeVisible();

    userEvent.click(panelFour);
    expect(answerFour).toBeVisible();
  });
});
