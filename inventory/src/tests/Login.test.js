jest.mock('react-router-dom');
jest.mock('axios');

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../components/Login';
import axios from 'axios';
import { mockNavigate } from 'react-router-dom';

beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    mockNavigate.mockClear();
    window.alert = jest.fn();
});

test('renders login form with all elements', () => {
    render(<Login />);

    expect(screen.getByText('Inview Login')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText(/Create an account/i)).toBeInTheDocument();
});

test('successful admin login navigates to /admin/products', async () => {
    axios.post.mockResolvedValueOnce({
        data: {
            role: 'Admin',
            token: 'admin-token-123',
            username: 'adminuser',
        },
    });

    render(<Login />);

    fireEvent.change(screen.getByPlaceholderText('Username'), {
        target: { value: 'adminuser' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
        target: { value: 'password123' },
    });
    fireEvent.click(screen.getByText('Login'));

    await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith(
            'https://localhost:7195/api/Auth/login',
            {
                username: 'adminuser',
                password: 'password123',
            }
        );
    });

    expect(mockNavigate).toHaveBeenCalledWith('/admin/products');
    expect(localStorage.getItem('token')).toBe('admin-token-123');
    expect(localStorage.getItem('role')).toBe('Admin');
    expect(localStorage.getItem('username')).toBe('adminuser');
});

test('successful staff login navigates to /staff/products', async () => {
    axios.post.mockResolvedValueOnce({
        data: {
            role: 'Staff',
            token: 'staff-token-456',
            username: 'staffuser',
        },
    });

    render(<Login />);

    fireEvent.change(screen.getByPlaceholderText('Username'), {
        target: { value: 'staffuser' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
        target: { value: 'password456' },
    });
    fireEvent.click(screen.getByText('Login'));

    await waitFor(() => {
        expect(axios.post).toHaveBeenCalled();
    });

    expect(mockNavigate).toHaveBeenCalledWith('/staff/products');
    expect(localStorage.getItem('token')).toBe('staff-token-456');
    expect(localStorage.getItem('role')).toBe('Staff');
    expect(localStorage.getItem('username')).toBe('staffuser');
});

test('displays API error message on login failure', async () => {
    axios.post.mockRejectedValueOnce({
        response: {
            data: {
                message: 'Invalid credentials',
            },
        },
    });

    render(<Login />);

    fireEvent.change(screen.getByPlaceholderText('Username'), {
        target: { value: 'wronguser' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
        target: { value: 'wrongpass' },
    });
    fireEvent.click(screen.getByText('Login'));

    expect(await screen.findByText('Invalid credentials')).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
});

test('displays generic error message on network error', async () => {
    axios.post.mockRejectedValueOnce(new Error('Network Error'));

    render(<Login />);

    fireEvent.change(screen.getByPlaceholderText('Username'), {
        target: { value: 'user' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
        target: { value: 'pass' },
    });
    fireEvent.click(screen.getByText('Login'));

    expect(await screen.findByText('Network or server error')).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
});

test('clears error on new login attempt', async () => {
    axios.post.mockRejectedValueOnce({
        response: { data: { message: 'Invalid credentials' } },
    });

    render(<Login />);

    fireEvent.change(screen.getByPlaceholderText('Username'), {
        target: { value: 'user1' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
        target: { value: 'pass1' },
    });
    fireEvent.click(screen.getByText('Login'));

    expect(await screen.findByText('Invalid credentials')).toBeInTheDocument();

    // mock a successful login and try again
    axios.post.mockResolvedValueOnce({
        data: {
            role: 'Admin',
            token: 'token123',
            username: 'admin',
        },
    });

    fireEvent.change(screen.getByPlaceholderText('Username'), {
        target: { value: 'admin' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
        target: { value: 'correctpass' },
    });
    fireEvent.click(screen.getByText('Login'));

    await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/admin/products');
    });

    // error should be cleared
    expect(screen.queryByText('Invalid credentials')).not.toBeInTheDocument();
});

test('requires username and password fields', () => {
    render(<Login />);

    const usernameInput = screen.getByPlaceholderText('Username');
    const passwordInput = screen.getByPlaceholderText('Password');

    expect(usernameInput).toHaveAttribute('required');
    expect(passwordInput).toHaveAttribute('required');
});

test('case-insensitive role comparison for navigation', async () => {
    // Even if role returned is 'ADMIN' (uppercase), it should navigate to /admin/products
    axios.post.mockResolvedValueOnce({
        data: {
            role: 'ADMIN',
            token: 'token789',
            username: 'testadmin',
        },
    });

    render(<Login />);

    fireEvent.change(screen.getByPlaceholderText('Username'), {
        target: { value: 'testadmin' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
        target: { value: 'testpass' },
    });
    fireEvent.click(screen.getByText('Login'));

    await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/admin/products');
    });
});
