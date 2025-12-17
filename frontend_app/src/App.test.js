import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('renders header title and input placeholder', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /to ?do list/i })).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/add a new task/i)).toBeInTheDocument();
});

test('adds a task and displays it', () => {
  render(<App />);
  const input = screen.getByPlaceholderText(/add a new task/i);
  fireEvent.change(input, { target: { value: 'Buy milk' } });
  fireEvent.click(screen.getByRole('button', { name: /add task/i }));
  expect(screen.getByText('Buy milk')).toBeInTheDocument();
});
