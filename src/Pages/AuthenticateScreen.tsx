import * as React from 'react';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest, getRedirectUrl } from 'expo-auth-session';
import { Button, View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { GitHubLoginButton } from '../Components/LoginButtons/GithubLoginButton';

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
            scopes: ['user', 'repo'],
            // For usage in managed apps using the proxy
            redirectUri: makeRedirectUri({
                // For usage in bare and standalone
                // native: 'https://auth.expo.io/@allig256/GitKeep',
                native: 'http://localhost:19006',
            }),
        },
        discovery
    );

    const [code, setCode] = React.useState("");
    const [token, setToken] = React.useState("");

    const findRepos = () => {
        const url = 'https://api.github.com/user/repos'
        const headers = new Headers({
            'Authorization': 'Token ' + token
        })

        fetch(url, { method: 'GET', headers: headers })
            .then(res => res.json())
            .then(data => console.log(data))
            .catch(err => console.log(err))
    }

    const getToken = () => {
        const url = 'https://github.com/login/oauth/access_token';
        const headers = new Headers({
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        });

        console.log(code);

        fetch('https://cors-anywhere.herokuapp.com/' + url + '?client_id=0ebefb6bb5e94c6193a0&client_secret=1905a7cc5a255be077df3fc6a848ba2de15e2913&code=' + code, { method: 'POST', headers: headers })
            .then(res => res.json())
            .then(data => setToken(data.access_token))
            .catch(err => console.log(err))
    }


    React.useEffect(() => {
        if (response?.type === 'success') {
            const { code } = response.params;
            setCode(code);
            //   getToken();
        }
    }, [response]);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

            <GitHubLoginButton
                disabled={!request}
                onPress={() => promptAsync()}
            />

            <Button
                disabled={!request}
                title="Get Token"
                onPress={() => {
                    getToken();
                }}
            />
            <Button
                disabled={!request}
                title="Get repos"
                onPress={() => {
                    findRepos();
                }}
            />
            <Text>
                {getRedirectUrl()}
            </Text>
            <Text>
                {code}
            </Text>
            <Text>
                {token}
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