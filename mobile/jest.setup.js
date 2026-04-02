jest.mock('expo-constants', () => ({
  expoConfig: {
    extra: {
      urlMobileApp: 'http://example.test',
    },
  },
}));

jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const { View } = require('react-native');

  return {
    SafeAreaProvider: ({ children }) => React.createElement(View, null, children),
    SafeAreaView: ({ children, ...props }) =>
      React.createElement(View, props, children),
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  };
});

jest.mock('react-native-webview', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    WebView: React.forwardRef((props, ref) => {
      // expose goBack so we can assert BackHandler behavior
      if (ref && typeof ref === 'object') {
        const goBack = jest.fn();
        ref.current = { goBack };
        globalThis.__WEBVIEW_GO_BACK__ = goBack;
      }
      return React.createElement(View, { ...props, testID: 'webview' }, null);
    }),
  };
});
