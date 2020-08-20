import * as React from 'react';
import { Text, SafeAreaView, Button , StyleSheet, ScrollView, View, TouchableOpacity } from 'react-native';
import { Appearance, useColorScheme } from 'react-native-appearance';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';

import Constants from 'expo-constants';


// Endpoint
const discovery = {
    authorizationEndpoint: 'https://github.com/login/oauth/authorize',
    tokenEndpoint: 'https://github.com/login/oauth/access_token',
    revocationEndpoint: 'https://github.com/settings/connections/applications/<CLIENT_ID>',
};

const HomeScreen = () => {

    Appearance.getColorScheme();
    const colorScheme = useColorScheme();

    const themeStatusBarStyle =
        colorScheme === 'light' ? 'dark-content' : 'light-content';
    const themeContainerStyle =
        colorScheme === 'light' ? styles.lightContainer : styles.darkContainer;

    const [request, response, promptAsync] = useAuthRequest(
        {
            clientId: 'CLIENT_ID',
            scopes: ['identity'],
            // For usage in managed apps using the proxy
            redirectUri: makeRedirectUri({
                // For usage in bare and standalone
                native: 'your.app://redirect',
            }),
        },
        discovery
    );

    React.useEffect(() => {
        if (response ?.type === 'success') {
            const { code } = response.params;
        }
    }, [response]);

    return (
        <SafeAreaView style={[styles.container, themeContainerStyle]}>
            <Button
                disabled={!request}
                title="Login"
                onPress={() => {
                    promptAsync();
                }}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    lightContainer: {
        backgroundColor: '#fff',
    },
    darkContainer: {
        backgroundColor: '#242C40',
    },
});

export default HomeScreen;
