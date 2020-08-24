import * as React from 'react';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest, getRedirectUrl } from 'expo-auth-session';
import { Button, View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { GitHubLoginButton } from '../Components/LoginButtons/GitHubLoginButton';
import * as SecureStore from 'expo-secure-store';
import * as Linking from 'expo-linking'
import { useNavigation } from '@react-navigation/native';
import { Appearance, useColorScheme } from 'react-native-appearance';

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
    const themeActivityIndicator =
        colorScheme === 'light' ? 'black' : 'white';


    const [request, response, promptAsync] = useAuthRequest(
        {
            clientId: '0ebefb6bb5e94c6193a0',
            scopes: ['user', 'repo'],
            redirectUri: Linking.makeUrl()
        },
        discovery
    );

    const getToken = async (code: string) => {
        const url = 'https://github.com/login/oauth/access_token';

        //figure out this header, bit dodgy 
        const headers = new Headers({
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            "X-Requested-With": "XMLHttpRequest"
        });

        await fetch('https://cors-anywhere.herokuapp.com/' + url + '?client_id=0ebefb6bb5e94c6193a0&client_secret=1905a7cc5a255be077df3fc6a848ba2de15e2913&code=' + code, { method: 'POST', headers: headers })
            .then(res => res.json())
            .then(async (data) => {
                await SecureStore.setItemAsync('github_token', data.access_token);
            })
            .catch(err => console.log(err))
    }

    const getUserInfo = async () => {
        const url = 'https://api.github.com/user';
        const token = await SecureStore.getItemAsync('github_token');

        const headers = new Headers({
            'Authorization': 'Token ' + token,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            "X-Requested-With": "XMLHttpRequest"
        });

        await fetch('https://cors-anywhere.herokuapp.com/' + url, { method: 'GET', headers: headers })
            .then(res => res.json())
            .then(async (data) => {
                console.log(data);
                await SecureStore.setItemAsync('user_name', data.login);
            })
            .catch(err => console.log(err))
    }

    React.useEffect(() => {

        async function fetchMyToken() {
            if (response?.type === 'success') {
                const { code } = response.params;
                setLoadingToken(true);
                await getToken(code);
                await getUserInfo();
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
                    <ActivityIndicator color={themeActivityIndicator} size={40} />
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
        paddingTop: 40,
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