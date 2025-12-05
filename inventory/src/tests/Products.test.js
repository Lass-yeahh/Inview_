// import React from 'react';
// import { render, screen, fireEvent, waitFor } from '@testing-library/react';
// import Products from '../components/Products';
// import axios from 'axios';

// jest.mock('axios');

// beforeEach(() => {
//     jest.clearAllMocks();
//     localStorage.clear();
//     // provide a token in localStorage if component reads it
//     localStorage.setItem('token', 'test-token');
//     // stub window.alert and confirm
//     window.alert = jest.fn();
//     window.confirm = jest.fn(() => true);
// });

// test('renders products from API', async () => {
//     axios.get.mockResolvedValueOnce({
//         data: [
//             {
//                 id: 1,
//                 name: 'Product A',
//                 sku: 'PA-01',
//                 quantity: 5,
//                 minStock: 2,
//                 category: 'CatA',
//                 price: 9.99,
//             },
//         ],
//     });

//     render(<Products />);

//     expect(await screen.findByText('Product A')).toBeInTheDocument();
//     expect(screen.getByText('PA-01')).toBeInTheDocument();
//     expect(screen.getByText('5')).toBeInTheDocument();
// });

// test('search filters products by name or SKU', async () => {
//     axios.get.mockResolvedValueOnce({
//         data: [
//             { id: 1, name: 'Apple', sku: 'A1', quantity: 1, minStock: 0, category: 'F', price: 1 },
//             { id: 2, name: 'Banana', sku: 'B1', quantity: 2, minStock: 0, category: 'F', price: 2 },
//         ],
//     });

//     render(<Products />);

//     expect(await screen.findByText('Apple')).toBeInTheDocument();

//     const input = screen.getByPlaceholderText('Search by name or SKU...');
//     fireEvent.change(input, { target: { value: 'Banana' } });

//     expect(screen.queryByText('Apple')).not.toBeInTheDocument();
//     expect(screen.getByText('Banana')).toBeInTheDocument();

//     // search a missing term
//     fireEvent.change(input, { target: { value: 'zzz' } });
//     expect(await screen.findByText('No products found.')).toBeInTheDocument();
// });

// test('add, edit, and delete product operations', async () => {
//     // Test 1: Add product
//     axios.get.mockResolvedValueOnce({ data: [] });
//     axios.post.mockResolvedValueOnce({});
//     axios.get.mockResolvedValueOnce({ data: [{ id: 3, name: 'NewProd', sku: 'N1', quantity: 0, minStock: 1, category: 'C', price: 5 }] });

//     render(<Products />);

//     expect(await screen.findByText('No products found.')).toBeInTheDocument();

//     const addBtn = screen.getByLabelText('Add Product');
//     fireEvent.click(addBtn);

//     const textboxes = screen.getAllByRole('textbox');
//     const spinbuttons = screen.getAllByRole('spinbutton');

//     fireEvent.change(textboxes[0], { target: { value: 'NewProd' } });
//     fireEvent.change(spinbuttons[0], { target: { value: '1' } });
//     fireEvent.change(textboxes[1], { target: { value: 'C' } });
//     fireEvent.change(spinbuttons[1], { target: { value: '5' } });

//     fireEvent.click(screen.getByText('Add'));

//     await waitFor(() => expect(axios.post).toHaveBeenCalled());
//     expect(window.alert).toHaveBeenCalledWith('Product Added Successfully');
//     expect(await screen.findByText('NewProd')).toBeInTheDocument();

//     // Test 2: Edit product
//     axios.put.mockResolvedValueOnce({});
//     axios.get.mockResolvedValueOnce({ data: [{ id: 3, name: 'NewProd', sku: 'N1', quantity: 10, minStock: 1, category: 'C', price: 5 }] });

//     const editBtn = screen.getByLabelText('Edit NewProd');
//     fireEvent.click(editBtn);

//     const qtyInput = screen.getByDisplayValue('0');
//     fireEvent.change(qtyInput, { target: { value: '10' } });

//     fireEvent.click(screen.getByText('Update'));

//     await waitFor(() => expect(axios.put).toHaveBeenCalled());
//     expect(await screen.findByText('10')).toBeInTheDocument();

//     // Test 3: Delete product
//     axios.delete.mockResolvedValueOnce({});
//     axios.get.mockResolvedValueOnce({ data: [] });

//     const delBtn = screen.getByLabelText('Delete NewProd');
//     fireEvent.click(delBtn);

//     await waitFor(() => expect(axios.delete).toHaveBeenCalled());
//     expect(await screen.findByText('No products found.')).toBeInTheDocument();
// });

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Products from '../components/Products';
import axios from 'axios';

jest.mock('axios');

beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    localStorage.setItem('token', 'test-token');
    window.alert = jest.fn();
    window.confirm = jest.fn(() => true);
});

test('renders products from API', async () => {
    axios.get.mockResolvedValueOnce({
        data: [
            {
                id: 1,
                name: 'Product A',
                sku: 'PA-01',
                quantity: 5,
                minStock: 2,
                category: 'CatA',
                price: 9.99,
            },
        ],
    });

    render(<Products />);

    expect(await screen.findByText('Product A')).toBeInTheDocument();
    expect(screen.getByText('PA-01')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
});

test('search filters products by name or SKU', async () => {
    axios.get.mockResolvedValueOnce({
        data: [
            { id: 1, name: 'Laptop', sku: 'LAP-01', quantity: 5, minStock: 1, category: 'Electronics', price: 50000 },
            { id: 2, name: 'Mouse', sku: 'MOU-01', quantity: 10, minStock: 2, category: 'Electronics', price: 500 },
        ],
    });

    render(<Products />);

    // wait for first item
    expect(await screen.findByText('Laptop')).toBeInTheDocument();

    const input = screen.getByPlaceholderText('Search by name or SKU...');

    // filter to Mouse
    fireEvent.change(input, { target: { value: 'Mouse' } });
    expect(screen.queryByText('Laptop')).not.toBeInTheDocument();
    expect(screen.getByText('Mouse')).toBeInTheDocument();

    // search a missing term
    fireEvent.change(input, { target: { value: 'zzz' } });
    expect(await screen.findByText('No products found.')).toBeInTheDocument();
});

test('add, edit, and delete product operations', async () => {
    // Test 1: Add product
    axios.get.mockResolvedValueOnce({ data: [] });
    axios.post.mockResolvedValueOnce({});
    axios.get.mockResolvedValueOnce({
        data: [
            { id: 3, name: 'NewProd', sku: 'N1', quantity: 0, minStock: 1, category: 'C', price: 5 },
        ],
    });

    render(<Products />);

    expect(await screen.findByText('No products found.')).toBeInTheDocument();

    const addBtn = screen.getByLabelText('Add Product');
    fireEvent.click(addBtn);

    const textboxes = screen.getAllByRole('textbox');
    const spinbuttons = screen.getAllByRole('spinbutton');

    fireEvent.change(textboxes[0], { target: { value: 'NewProd' } });
    fireEvent.change(spinbuttons[0], { target: { value: '1' } });
    fireEvent.change(textboxes[1], { target: { value: 'C' } });
    fireEvent.change(spinbuttons[1], { target: { value: '5' } });

    fireEvent.click(screen.getByText('Add'));

    await waitFor(() => expect(axios.post).toHaveBeenCalled());
    expect(window.alert).toHaveBeenCalledWith('Product Added Successfully');
    expect(await screen.findByText('NewProd')).toBeInTheDocument();

    // Test 2: Edit product
    axios.put.mockResolvedValueOnce({});
    axios.get.mockResolvedValueOnce({
        data: [
            { id: 3, name: 'NewProd', sku: 'N1', quantity: 10, minStock: 1, category: 'C', price: 5 },
        ],
    });

    const editBtn = screen.getByLabelText('Edit NewProd');
    fireEvent.click(editBtn);

    const qtyInput = screen.getByDisplayValue('0');
    fireEvent.change(qtyInput, { target: { value: '10' } });

    fireEvent.click(screen.getByText('Update'));

    await waitFor(() => expect(axios.put).toHaveBeenCalled());
    expect(await screen.findByText('10')).toBeInTheDocument();

    // Test 3: Delete product
    axios.delete.mockResolvedValueOnce({});
    axios.get.mockResolvedValueOnce({ data: [] });

    const delBtn = screen.getByLabelText('Delete NewProd');
    fireEvent.click(delBtn);

    await waitFor(() => expect(axios.delete).toHaveBeenCalled());
    expect(await screen.findByText('No products found.')).toBeInTheDocument();
});
