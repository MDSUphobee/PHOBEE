import { render, screen } from '@testing-library/react';

import Navbar from '@/components/landing/Navbar';
import { ThemeProvider } from '@/components/ThemeProvider';

function renderNavbar() {
  return render(
    <ThemeProvider>
      <Navbar />
    </ThemeProvider>
  );
}

describe('<Navbar />', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('shows auth links when logged out', async () => {
    renderNavbar();
    expect(await screen.findByRole('link', { name: 'Se connecter' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: "S'inscrire" })).toBeInTheDocument();
  });

  it('shows dashboard CTA when logged in', async () => {
    localStorage.setItem('token', 'test-token');
    renderNavbar();
    expect(await screen.findByRole('link', { name: 'Mon Espace' })).toBeInTheDocument();
  });
});
