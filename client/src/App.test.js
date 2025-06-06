import { render, screen } from '@testing-library/react';

test('renders hello world message', () => {
    render(<div>Hello, World!</div>);
    const headingElement = screen.getByText(/Hello, world!/i);
    expect(headingElement).toBeInTheDocument();
});
