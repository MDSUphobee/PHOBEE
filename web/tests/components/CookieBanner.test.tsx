import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { CookieBanner } from '@/components/CookieBanner';

describe('<CookieBanner />', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('shows banner on first visit and can accept cookies', async () => {
    const user = userEvent.setup();
    render(<CookieBanner />);

    await screen.findByText('Gestion des cookies');
    await user.click(screen.getByRole('button', { name: 'Accepter' }));

    expect(localStorage.getItem('phobee_cookie_consent_v1')).toBe('accepted');
    await waitFor(() => {
      expect(screen.queryByText('Gestion des cookies')).toBeNull();
    });
  });

  it('does not show if consent already stored', async () => {
    localStorage.setItem('phobee_cookie_consent_v1', 'rejected');
    render(<CookieBanner />);

    await waitFor(() => {
      expect(screen.queryByText('Gestion des cookies')).toBeNull();
    });
  });
});
