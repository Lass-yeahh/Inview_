import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import Register from '../components/Register';
import { mockNavigate } from 'react-router-dom';

jest.mock('axios');

beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
});

test('shows password mismatch error', async () => {
    render(<Register />);

    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'u1' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'p1' } });
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: 'p2' } });

    fireEvent.click(screen.getByText('Register'));

    expect(await screen.findByText('Passwords do not match')).toBeInTheDocument();
});

test('successful registration navigates to login after delay', async () => {
    jest.useFakeTimers();
    axios.post.mockResolvedValueOnce({});

    render(<Register />);

    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'newuser' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'secret' } });
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: 'secret' } });

    fireEvent.click(screen.getByText('Register'));

    expect(await screen.findByText(/Registration successful/i)).toBeInTheDocument();

    jest.advanceTimersByTime(1500);

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/login'));
    jest.useRealTimers();
});
