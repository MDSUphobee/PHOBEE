/** @jest-environment node */

import { POST } from '@/app/api/login/route';

describe('POST /api/login (proxy)', () => {
  beforeEach(() => {
    (global.fetch as any) = jest.fn();
    delete process.env.API_BASE;
  });

  it('returns 500 when API_BASE is missing', async () => {
    const req = new Request('http://test/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'a@b.com', password: 'x' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.message).toMatch(/API_BASE/);
  });

  it('returns token and enriches user when backend does not include it', async () => {
    process.env.API_BASE = 'https://backend.example.test/';

    (global.fetch as any)
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ token: 't1' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify([{ id: 123, email: 'a@b.com' }]), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );

    const req = new Request('http://test/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'a@b.com', password: 'x' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.token).toBe('t1');
    expect(data.user).toEqual({ id: 123, email: 'a@b.com' });
  });
});
