import * as React from 'react';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest, getRedirectUrl } from 'expo-auth-session';
import { Button, View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { GitHubLoginButton } from '../Components/LoginButtons/GitHubLoginButton';
import * as SecureStore from 'expo-secure-store';
import * as Linking from 'expo-linking'
import { useNavigation } from '@react-navigation/native';

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
    const [token, setToken] = React.useState("");

    const [request, response, promptAsync] = useAuthRequest(
        {
            clientId: '0ebefb6bb5e94c6193a0',
            scopes: ['user', 'repo'],
            // For usage in managed apps using the proxy
            // redirectUri: makeRedirectUri({
            //     // For usage in bare and standalone
            //     // native: 'https://auth.expo.io/@allig256/GitKeep',
            //     native: 'gitkeep://',
            //     // useProxy: true,
            // }),
            // redirectUri: getRedirectUrl()
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
                setToken(data.access_token);
                await SecureStore.setItemAsync('github_token', data.access_token);
            })
            .catch(err => console.log(err))

        await SecureStore.getItemAsync('github_token');
        navigation.navigate('RepoSelectScreen');
    }

    React.useEffect(() => {
        async function fetchMyToken() {
            
            if (response?.type === 'success') {
                const { code } = response.params;                
                await getToken(code);
            }
        }

        fetchMyToken()
    }, [response]);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

            <GitHubLoginButton
                disabled={!request}
                onPress={() => promptAsync()}
            />
            <Text>
                {getRedirectUrl()}
            </Text>
            <Text>
                {"token = " + token}
            </Text>
            <Text>
                {Linking.makeUrl()}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    githubStyle: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#333",
        borderWidth: 0.5,
        borderColor: "#fff",
        height: 40,
        width: 220,
        borderRadius: 5,
        margin: 5
    },
    imageIconStyle: {
        padding: 10,
        marginLeft: 15,
        height: 25,
        width: 25,
        resizeMode: "stretch"
    },
    textStyle: {
        color: "#fff",
        marginLeft: 20,
        marginRight: 20
    }
});