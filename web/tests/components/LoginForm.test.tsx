import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import LoginForm from '@/components/auth/Login';

const push = jest.fn();
const refresh = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push, refresh }),
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

describe('<LoginForm />', () => {
  beforeEach(() => {
    localStorage.clear();
    push.mockClear();
    refresh.mockClear();
    (global.fetch as any) = jest.fn();
    process.env.NEXT_PUBLIC_API_BASE = 'https://api.example.test';
  });

  it('shows validation error for invalid email', async () => {
    const user = userEvent.setup();
    const { container } = render(<LoginForm />);

    await user.type(screen.getByLabelText('Email'), 'invalid');
    await user.type(screen.getByLabelText('Mot de passe'), 'secret');
    fireEvent.submit(container.querySelector('form')!);

    expect(await screen.findByText('Email invalide.')).toBeInTheDocument();
  });

  it('stores token and redirects on success', async () => {
    const user = userEvent.setup();

    (global.fetch as any)
      .mockResolvedValueOnce(
        {
          ok: true,
          status: 200,
          json: async () => ({ token: 't1', user: { id: 1, name: 'A' } }),
        }
      );

    const { container } = render(<LoginForm />);
    await user.type(screen.getByLabelText('Email'), 'a@b.com');
    await user.type(screen.getByLabelText('Mot de passe'), 'secret');
    fireEvent.submit(container.querySelector('form')!);

    await waitFor(() => expect(push).toHaveBeenCalledWith('/profile'));
    expect(localStorage.getItem('token')).toBe('t1');
    expect(localStorage.getItem('user')).toContain('"id":1');
  });
});
