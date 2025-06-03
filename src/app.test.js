import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

describe('To-Do App', () => {
  it('renders the app without crashing', () => {
    render(<App />);
    expect(screen.getByText(/to-do/i)).toBeInTheDocument();
  });

  it('can add a new todo', () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/add a new task/i);
    fireEvent.change(input, { target: { value: 'Buy milk' } });
    fireEvent.click(screen.getByText(/add/i));
    expect(screen.getByText('Buy milk')).toBeInTheDocument();
  });

  // Add more tests for completing or deleting todos
});