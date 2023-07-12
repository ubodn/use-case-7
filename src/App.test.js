import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import App from './App';

global.fetch = jest.fn();

describe('MyFormComponent, Positive Test Cases ', () => {
  //1.	Submit the form with all fields filled in correctly: a name of 3 or more characters, a valid email, 'Agree to Terms' checked, and a gender selected.
  test('submits the form with all fields filled correctly', async () => {
    render(<App />);
    fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'johndoe@example.com' } });
    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.click(screen.getByDisplayValue('male'));

    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('https://localhost:3000/api/', {
        method: 'POST',
        body: {
          data: {
            name: 'John Doe',
            email: 'johndoe@example.com',
            agreeTerms: true,
            gender: 'male',
          },
        },
      });
    });
  });

  //2.	Submit the form with a very long valid name to check if the form can handle names of any length.
  test('submits the form with a very long valid name', async () => {
    render(<App />);

    fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'John Doe'.repeat(100) } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'johndoe@example.com' } });
    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.click(screen.getByDisplayValue('male'));

    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('https://localhost:3000/api/', {
        method: 'POST',
        body: {
          data: {
            name: 'John Doe'.repeat(100),
            email: 'johndoe@example.com',
            agreeTerms: true,
            gender: 'male',
          },
        },
      });
    });
  });

  //3.	Submit the form with a complex email address that is valid (e.g., test.name+alias@example.co.uk) to test the robustness of the email validation.
  test('submits the form with a complex valid email address', async () => {
    render(<App />);

    fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test.name+alias@example.co.uk' } });
    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.click(screen.getByDisplayValue('male'));

    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('https://localhost:3000/api/', {
        method: 'POST',
        body: {
          data: {
            name: 'John Doe',
            email: 'test.name+alias@example.co.uk',
            agreeTerms: true,
            gender: 'male',
          },
        },
      });
    });

    //4.	Change the gender from male to female and submit the form with all other fields filled in correctly
    fireEvent.click(screen.getByDisplayValue('female'));
    fireEvent.click(screen.getByRole('button'));
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('https://localhost:3000/api/', {
        method: 'POST',
        body: {
          data: {
            name: 'John Doe',
            email: 'test.name+alias@example.co.uk',
            agreeTerms: true,
            gender: 'female',
          },
        },
      });
    });

    //5.	Re-submit the form after an initial successful submission with all fields filled in correctly.
    fireEvent.click(screen.getByRole('button'));
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('https://localhost:3000/api/', {
        method: 'POST',
        body: {
          data: {
            name: 'John Doe',
            email: 'test.name+alias@example.co.uk',
            agreeTerms: true,
            gender: 'female',
          },
        },
      });
    });
  });
});

describe('MyFormComponent, Negative Test Cases ', () => {
  //6.	Submit the form with the 'Name' field left blank.
  test('submits the form with the "Name" field left blank', async () => {
    render(<App />);

    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'johndoe@example.com' } });
    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.click(screen.getByDisplayValue('male'));

    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(fetch).not.toHaveBeenCalled();
    });
    expect(screen.getByText('Name must be at least 3 characters.')).toBeInTheDocument();
  });

  //7.	Submit the form with an invalid email address (e.g., without the "@" symbol).
  test('submits the form with an invalid email address', async () => {
    render(<App />);

    fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'invalidemail.com' } });
    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.click(screen.getByDisplayValue('male'));

    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(fetch).not.toHaveBeenCalled();
    });
    expect(screen.getByText('Email must be valid.')).toBeInTheDocument();
  });

  //8.	Submit the form without checking the 'Agree to Terms' checkbox.
  test('submits the form without checking the "Agree to Terms" checkbox', async () => {
    render(<App />);

    fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'ijohndoe@example.com' } });
    fireEvent.click(screen.getByDisplayValue('male'));

    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(fetch).not.toHaveBeenCalled();
    });
    expect(screen.getByText('You must agree to the terms.')).toBeInTheDocument();
  });


  //9.	Submit the form without selecting a gender.
  test('submits the form without selecting a gender', async () => {
    render(<App />);

    fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'ijohndoe@example.com' } });
    fireEvent.click(screen.getByRole('checkbox'));

    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(fetch).not.toHaveBeenCalled();
    });
    expect(screen.getByText('You must select a gender.')).toBeInTheDocument();
  });

  //10.	Submit the form with a name that is less than 3 characters long.
  test('submits the form with a name less than 3 characters long', async () => {
    render(<App />);

    fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'JD' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'ijohndoe@example.com' } });
    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.click(screen.getByDisplayValue('male'));

    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(fetch).not.toHaveBeenCalled();
    });
    expect(screen.getByText('Name must be at least 3 characters.')).toBeInTheDocument();
  });
});
