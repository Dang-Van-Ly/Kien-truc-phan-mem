import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

vi.mock('./api', () => ({
  getMovies: vi.fn().mockResolvedValue([]),
  getBookings: vi.fn().mockResolvedValue([]),
  registerUser: vi.fn(),
  loginUser: vi.fn(),
  createMovie: vi.fn(),
  createBooking: vi.fn()
}));

describe('App', () => {
  it('renders main title', async () => {
    render(<App />);
    expect(await screen.findByText('Movie Ticket System')).toBeTruthy();
  });
});
