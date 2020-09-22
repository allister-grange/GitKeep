import * as React from 'react';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest, getRedirectUrl } from 'expo-auth-session';
import { Button, View, Text, Platform, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { GitHubLoginButton } from '../Components/LoginButtons/GitHubLoginButton';
import * as SecureStore from 'expo-secure-store';
import * as Linking from 'expo-linking'
import { useNavigation } from '@react-navigation/native';
import { Appearance, useColorScheme } from 'react-native-appearance';
import { getAccessToken, getAuthenticatedUserName } from '../Services/GitHub';

WebBrowser.maybeCompleteAuthSession();

// Endpoint
const discovery = {
    authorizationEndpoint: 'https://github.com/login/oauth/authorize',
    tokenEndpoint: 'https://github.com/login/oauth/access_token',
    revocationEndpoint: 'https://github.com/settings/connections/applications/0ebefb6bb5e94c6193a0',
};

// https://auth.expo.io/@allig256/GitKeep

export default function App() {

    const navigation = useNavigation();
    Appearance.getColorScheme();
    const colorScheme = useColorScheme();
    const [loadingToken, setLoadingToken] = React.useState(false);

    const themeContainerStyle =
        colorScheme === 'light' ? styles.lightContainer : styles.darkContainer;
    const themeTitleStyle =
        colorScheme === 'light' ? styles.lightTitle : styles.darkTitle;
    const themeTitleContainer =
        colorScheme === 'light' ? styles.lightTitleContainer : styles.darkTitleContainer;
    const themeTextStyle =
        colorScheme === 'light' ? styles.lightText : styles.darkText;

    const [request, response, promptAsync] = useAuthRequest(
        {
            clientId: '0ebefb6bb5e94c6193a0',
            scopes: ['user', 'repo'],
            redirectUri: Linking.makeUrl()
        },
        discovery
    );

    React.useEffect(() => {

        async function fetchMyToken() {
            if (response?.type === 'success') {
                const { code } = response.params;
                setLoadingToken(true);
                await getAccessToken(code)
                    .then(res => SecureStore.setItemAsync('github_token', res))
                    .catch(err => alert(err));
                await getAuthenticatedUserName()
                    .then(res => SecureStore.setItemAsync('user_name', res))
                    .catch(err => alert(err));
                navigation.navigate('RepoSelectScreen');
                setLoadingToken(false);
            }
        }

        fetchMyToken()
    }, [response]);

    return (
        <SafeAreaView style={[styles.container, themeContainerStyle]}>
            <View style={[styles.titleContainer, themeTitleContainer]}>
                <Text style={[styles.title, themeTitleStyle]}>
                    Welcome,
                </Text>
                <Text style={[styles.text, themeTextStyle]}>
                    please choose a git provider below
                </Text>
            </View>
            <View style={styles.providerButtonsContainer}>
                {loadingToken ?
                    <ActivityIndicator color={'coral'} size={40} />
                    :
                    <GitHubLoginButton
                        disabled={!request}
                        onPress={() => promptAsync()}
                    />
                }
                <Text>{Linking.makeUrl()}</Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },
    lightContainer: {
        backgroundColor: 'white'
    },
    darkContainer: {
        backgroundColor: '#202020'
    },
    lightText: {
        color: 'black'
    },
    darkText: {
        color: 'white'
    },
    titleContainer: {
        width: '90%',
        paddingBottom: 15,
        paddingTop: Platform.OS === 'android' ? 25 : 0,
        borderBottomWidth: 1,
    },
    lightTitleContainer: {
        borderColor: '#d3d3d3',
    },
    darkTitleContainer: {
        borderColor: 'white',
    },
    lightTitle: {
        color: 'black',
    },
    darkTitle: {
        color: 'white'
    },
    title: {
        fontSize: 30
    },
    text: {
        paddingTop: 2,
        fontSize: 15
    },
    providerButtonsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});