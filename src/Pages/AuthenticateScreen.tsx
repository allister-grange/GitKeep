import * as React from 'react';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest, getRedirectUrl } from 'expo-auth-session';
import { Button, View, Text } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

// Endpoint
const discovery = {
  authorizationEndpoint: 'https://github.com/login/oauth/authorize',
  tokenEndpoint: 'https://github.com/login/oauth/access_token',
  revocationEndpoint: 'https://github.com/settings/connections/applications/<CLIENT_ID>',
};

// https://auth.expo.io/@allig256/GitKeep

export default function App() {
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: '0ebefb6bb5e94c6193a0',
      scopes: ['identity'],
      // For usage in managed apps using the proxy
      redirectUri: makeRedirectUri({
        // For usage in bare and standalone
        native: 'http://localhost:19006',
      }),
    },
    discovery
  );

  const [code, setCode] = React.useState("");

  React.useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params;
      setCode(code);
      }
  }, [response]);

  return (
      <View style={{flex:  1, justifyContent: 'center'}}>
    <Button
      disabled={!request}
      title="Login"
      onPress={() => {
        promptAsync();
        }}
    />
    <Text>
        {getRedirectUrl()}
    </Text>
    <Text>
        {code}
    </Text>
    </View>
  );
}