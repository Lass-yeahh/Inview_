import React from 'react';
import { render, screen } from '@testing-library/react';
import axios from 'axios';
import Alerts from '../components/Alerts';

jest.mock('axios');

beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    localStorage.setItem('token', 'test-token');
});

test('shows empty state when no alerts returned', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });

    render(<Alerts />);

    expect(await screen.findByText('All items are in good stock')).toBeInTheDocument();
    expect(localStorage.getItem('alertCount')).toBe('0');
});

test('displays alerts table with correct status and classes', async () => {
    axios.get.mockResolvedValueOnce({
        data: [
            { id: 1, name: 'Prod Critical', sku: 'C-1', quantity: 1 },
            { id: 2, name: 'Prod Low', sku: 'L-1', quantity: 5 },
        ],
    });

    render(<Alerts />);

    // rows rendered
    expect(await screen.findByText('Prod Critical')).toBeInTheDocument();
    expect(screen.getByText('C-1')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();

    expect(screen.getByText('Prod Low')).toBeInTheDocument();
    expect(screen.getByText('L-1')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();

    // status texts
    const critical = screen.getByText('Critical');
    expect(critical).toBeInTheDocument();
    expect(critical).toHaveClass('critical');
    expect(critical).toHaveClass('blink');

    const low = screen.getByText('Low Stock');
    expect(low).toBeInTheDocument();
    expect(low).toHaveClass('warning');
});

test('shows error message when API fails', async () => {
    axios.get.mockRejectedValueOnce(new Error('Network error'));

    render(<Alerts />);

    expect(await screen.findByText('Failed to load alerts')).toBeInTheDocument();
});
