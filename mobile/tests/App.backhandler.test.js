import React from 'react';
import { act, render } from '@testing-library/react-native';

import { BackHandler, Platform } from 'react-native';

let mockBackPressHandler;
let mockRemove;

import App from '../App';

describe('App (Android back)', () => {
  const originalOS = Platform.OS;

  beforeAll(() => {
    try {
      Object.defineProperty(Platform, 'OS', { value: 'android' });
    } catch {
      // fallback: if OS is not configurable, tests will still validate wiring when possible
    }
  });

  afterAll(() => {
    try {
      Object.defineProperty(Platform, 'OS', { value: originalOS });
    } catch {
      // ignore
    }
  });

  beforeEach(() => {
    mockBackPressHandler = undefined;
    mockRemove = jest.fn();

    BackHandler.addEventListener = jest.fn((eventName, handler) => {
      mockBackPressHandler = handler;
      return { remove: mockRemove };
    });
  });

  it('returns false when no history', () => {
    render(<App />);
    expect(typeof mockBackPressHandler).toBe('function');
    expect(mockBackPressHandler()).toBe(false);
  });

  it('calls webview.goBack when canGoBack is true', async () => {
    const { getByTestId } = render(<App />);
    const webview = getByTestId('webview');

    // simulate navigation state change
    await act(async () => {
      webview.props.onNavigationStateChange({ canGoBack: true });
    });

    // trigger android back
    expect(mockBackPressHandler()).toBe(true);

    expect(globalThis.__WEBVIEW_GO_BACK__).toBeDefined();
    expect(globalThis.__WEBVIEW_GO_BACK__).toHaveBeenCalledTimes(1);
  });
});
