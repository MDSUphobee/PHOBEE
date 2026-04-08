import { cn } from '@/lib/utils';

describe('cn', () => {
  it('merges classnames and tailwind conflicts', () => {
    expect(cn('p-2', false && 'hidden', 'p-4')).toBe('p-4');
  });
});
