/** @jest-environment node */

import { POST } from '@/app/api/register/route';

describe('POST /api/register (proxy)', () => {
  beforeEach(() => {
    (global.fetch as any) = jest.fn();
    delete process.env.API_BASE;
  });

  it('returns 500 when API_BASE is missing', async () => {
    const req = new Request('http://test/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'a@b.com' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.message).toMatch(/API_BASE/);
  });

  it('returns 201 when backend succeeds', async () => {
    process.env.API_BASE = 'https://backend.example.test';

    (global.fetch as any).mockResolvedValueOnce(
      new Response(JSON.stringify({ id: 1 }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      })
    );

    const req = new Request('http://test/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'a@b.com', password: 'x' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(201);
    await expect(res.json()).resolves.toEqual({ id: 1 });
  });
});
