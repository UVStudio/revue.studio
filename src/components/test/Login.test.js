import userEvent from '@testing-library/user-event';
import { render, screen, fireEvent } from '../../test-utils/test-utils';
import { emailValidation } from '../Login';
import Login from '../Login';

describe('Login / Register screen tests', () => {
  test('Register and Login switch buttons load', () => {
    render(<Login />);

    const alreadyButton = screen.getByRole('button', {
      name: 'I already have an account',
    });
    const newUserButton = screen.getByRole('button', {
      name: 'I am a new user',
    });
    expect(alreadyButton).toBeVisible();
    expect(newUserButton).toBeVisible();
  });
  test('text boxes of Email and Password load', () => {
    render(<Login />);

    const emailTextBox = screen.getByRole('textbox', {
      name: 'E-mail',
    });
    expect(emailTextBox).toBeVisible();
    //Material UI's textfield prop type='password' removes RTL's ability to identify role as textbox
    //defaulting to getbyText
    //https://github.com/testing-library/dom-testing-library/issues/1128
    const passwordTextBox = screen.getByText('Password');
    expect(passwordTextBox).toBeVisible();
  });

  test('Login button loads', () => {
    render(<Login />);

    const loginButton = screen.getByRole('button', {
      name: 'Login',
    });

    expect(loginButton).toBeVisible();
  });

  test('Correct email input validates', () => {
    const correctEmail = 'username@gmail.com';
    const incorrectEmail = 'user.com';
    expect(emailValidation(correctEmail)).toBe(true);
    expect(emailValidation(incorrectEmail)).toBe(false);
  });

  test('Email input should accept string', () => {
    render(<Login />);

    const emailTextBox = screen.getByRole('textbox', {
      name: 'E-mail',
    });
    expect(emailTextBox.value).toMatch('');
    fireEvent.change(emailTextBox, { target: { value: 'test' } });
    expect(emailTextBox.value).toMatch('test');
  });

  //need to abstract out loginUserHandler to test it properly
  //https://stackoverflow.com/questions/69044787/react-testing-library-mocking-a-function
  // test('Login Button calls a function', async () => {
  //   render(<Login />);

  //   const loginButton = screen.getByRole('button', {
  //     name: 'Login',
  //   });

  //   const mockLogin = jest.fn();
  //   expect(loginButton).toBeVisible();
  //   fireEvent.submit(loginButton);
  //   expect(mockLogin).toHaveBeenCalledTimes(1);
  // });
});
