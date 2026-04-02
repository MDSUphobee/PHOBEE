import React from 'react';
import { render } from '@testing-library/react-native';

import App from '../App';

describe('App (WebView URL)', () => {
  it('uses urlMobileApp from expo-constants when provided', () => {
    const { getByTestId } = render(<App />);
    const webview = getByTestId('webview');
    expect(webview.props.source).toEqual({ uri: 'http://example.test' });
  });
});
