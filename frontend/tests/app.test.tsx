import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../src/App';
import { describe, expect, it } from 'vitest';

describe('App UI', () => {
  it('renders objective panel and allows tile selection interactions', async () => {
    render(<App />);
    expect(screen.getByText(/Moves Left/)).toBeInTheDocument();

    const firstTile = screen.getByRole('button', { name: 'tile-0-0' });
    const secondTile = screen.getByRole('button', { name: 'tile-0-1' });
    await userEvent.click(firstTile);
    await userEvent.click(secondTile);

    expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
  });
});
