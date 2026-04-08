import '@testing-library/jest-dom';

import React from 'react';

// matchMedia polyfill for ThemeProvider and other responsive logic
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }),
  });
}

// Make framer-motion render deterministically in unit tests
jest.mock('framer-motion', () => {
  const React = require('react');
  const passthrough = (props: any) => React.createElement('div', props, props.children);
  return {
    __esModule: true,
    AnimatePresence: ({ children }: any) => React.createElement(React.Fragment, null, children),
    motion: new Proxy(
      {},
      {
        get: () => passthrough,
      }
    ),
  };
});

// Next.js <Link> in tests
jest.mock('next/link', () => {
  return {
    __esModule: true,
    default: ({ href, children, ...props }: any) =>
      React.createElement('a', { href, ...props }, children),
  };
});

