import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import axios from 'axios';
import App from './App';

// Mock axios
jest.mock('axios');

describe('To-Do App', () => {
  beforeEach(() => {
    // Mock the axios.get call to /auth/user
    axios.get.mockResolvedValue({ 
      data: null 
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the app without crashing', async () => {
    render(<App />);
    const headerText = screen.getAllByText(/to-do list/i)[0];
    expect(headerText).toBeInTheDocument();
  });

  it('can add a new todo', async () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/add a new task/i);
    fireEvent.change(input, { target: { value: 'Buy milk' } });
    fireEvent.click(screen.getByText(/add/i));
    expect(screen.getByText('Buy milk')).toBeInTheDocument();
  });
});