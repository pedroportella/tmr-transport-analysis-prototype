import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { App } from './App';

describe('App', () => {
  it('renders the loading state first', () => {
    render(<App />);
    expect(screen.getByText('Loading transport scenario dataset...')).toBeTruthy();
  });
});
