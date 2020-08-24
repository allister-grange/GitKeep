import React, { useEffect, useState } from 'react';
import { Text, SafeAreaView, StatusBar, StyleSheet, ScrollView, View, TouchableOpacity } from 'react-native';
import { Appearance, useColorScheme } from 'react-native-appearance';
import { Note } from '../Components/Notes/Note';
import * as SecureStore from 'expo-secure-store';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useIsFocused } from '@react-navigation/native';

const HomeScreen = () => {

    Appearance.getColorScheme();
    const colorScheme = useColorScheme();
    const navigation = useNavigation();
    Appearance.getColorScheme();
    const isFocused = useIsFocused();
    const [repoName, setRepoName] = useState("");
    const [githubToken, setGithubToken] = useState("");
    const [userName, setUserName] = useState("");
    const [loadingNotes, setLoadingNotes] = useState(false);

    const themeStatusBarStyle =
        colorScheme === 'light' ? 'dark-content' : 'light-content';
    const themeContainerStyle =
        colorScheme === 'light' ? styles.lightContainer : styles.darkContainer;
    const themeNewNoteButtonStyle =
        colorScheme === 'light' ? styles.lightThemeNewNoteButton : styles.darkThemeNewNoteButton;

    const fetchRepoContents = async () => {
        console.log("fetching repo contents");

        setLoadingNotes(true);

        const repoName = await SecureStore.getItemAsync('repo_name');
        const githubToken = await SecureStore.getItemAsync('github_token');
        const userName = await SecureStore.getItemAsync('user_name');

        const url = 'https://api.github.com/repos/' + userName + '/' + repoName + '/contents/';
        
        const headers = new Headers({
            'Authorization': 'Token ' + githubToken,
            'Accept': 'application/vnd.github.v3+json',
            "X-Requested-With": "XMLHttpRequest"
        });

        await fetch('https://cors-anywhere.herokuapp.com/' + url, { method: 'GET', headers: headers })
            .then(res => res.json())
            .then(async (data) => {
                console.log(data);
            })
            .catch(err => console.log(err))
            
        setLoadingNotes(false);
    }

    async function fetchRepoName() {
        //TODO convert these all to props 

        const repoName = await SecureStore.getItemAsync('repo_name');
        const githubToken = await SecureStore.getItemAsync('github_token');
        const userName = await SecureStore.getItemAsync('user_name');

        if (repoName) {
            console.log("Repo from storage = " + repoName);
            setRepoName(repoName)
        }

        if (githubToken) {
            setGithubToken(githubToken)
            console.log("githubToken from storage = " + githubToken);

        }

        if (userName) {
            setUserName(userName)
            console.log("userName from storage = " + userName);

        }

        // TODO throw error here if the above failes
    }

    React.useEffect(() => {

        fetchRepoContents();

    }, []);

    return (
        <SafeAreaView style={[styles.container, themeContainerStyle]}>
            <StatusBar barStyle={themeStatusBarStyle} />
            <ScrollView style={styles.notesContatiner}>
                <Note />
                <Note />
                <Note />
                <Note />
                <Note />
                <Note />
                <Note />
                <Note />
                <Note />
                <Note />
                <Note />
                <Note />
                <Note />
            </ScrollView>
            <View style={styles.newNoteButtonContainer}>
                <TouchableOpacity style={[styles.newNoteButton, themeNewNoteButtonStyle]} onPress={() => navigation.navigate('CreateNoteScreen')}>
                    <Ionicons outline={false} name={'md-add'} size={35} color={'orange'} />
                </TouchableOpacity>
            </View>
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
        backgroundColor: '#202020',
    },
    lightThemeText: {
        color: '#242C40',
    },
    darkThemeText: {
        color: '#D0D0C0',
    },
    text: {
        fontSize: 17,
    },
    notesContatiner: {
        width: '100%',
    },
    newNoteButton: {
        borderRadius: 25,
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        shadowRadius: 3,
        elevation: 7,
    },
    lightThemeNewNoteButton: {
        backgroundColor: 'white',
    },
    darkThemeNewNoteButton: {
        backgroundColor: '#303030',
    },
    newNoteButtonContainer: {
        bottom: '3%',
        right: '7%',
        alignSelf: 'center',
        height: '10%',
        position: 'absolute',
    }
});

export default HomeScreen;