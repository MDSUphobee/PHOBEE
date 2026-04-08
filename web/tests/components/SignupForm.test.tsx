import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import SignupForm from '@/components/auth/Signup';

const push = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
  useSearchParams: () => new URLSearchParams(''),
}));

jest.mock('sonner', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

jest.mock('@/lib/user', () => ({
  saveUserQuestionnaireInfo: jest.fn(),
}));

describe('<SignupForm />', () => {
  beforeEach(() => {
    localStorage.clear();
    push.mockClear();
    (global.fetch as any) = jest.fn();
    process.env.NEXT_PUBLIC_API_BASE = 'https://api.example.test';
  });

  it('shows error when required fields missing', async () => {
    const user = userEvent.setup();
    const { container } = render(<SignupForm />);

    // user click on submit doesn't always trigger form submit in jsdom
    fireEvent.submit(container.querySelector('form')!);
    expect(await screen.findByText('Tous les champs sont requis.')).toBeInTheDocument();
  });

  it('registers then auto-logins and redirects', async () => {
    const user = userEvent.setup();
    (global.fetch as any)
      .mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: async () => ({ ok: true }),
      }) // register
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ token: 't2', user: { id: 2, name: 'B' } }),
      });

    const { container } = render(<SignupForm />);
    await user.type(screen.getByPlaceholderText('Pseudo'), 'bob');
    await user.type(screen.getByPlaceholderText('0600000000'), '0600000000');
    await user.type(screen.getByPlaceholderText('email@exemple.com'), 'b@c.com');
    await user.type(screen.getByPlaceholderText('Minimum 8 caractères'), 'secret');
    fireEvent.submit(container.querySelector('form')!);

    await waitFor(() => expect(push).toHaveBeenCalledWith('/profile'));
    expect(localStorage.getItem('token')).toBe('t2');
  });
});
