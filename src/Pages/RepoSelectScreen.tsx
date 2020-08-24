import React, { useState } from 'react';
import { Text, SafeAreaView, StatusBar, StyleSheet, TextInput, View, ScrollView, ActivityIndicator } from 'react-native';
import { Appearance, useColorScheme } from 'react-native-appearance';
import { Note } from '../Components/Notes/Note';
import Markdown from 'react-native-showdown';
import { DisplayRepoInfo } from '../Components/Repos/DisplayRepoInfo';
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';

const RepoSelectScreen = () => {

    Appearance.getColorScheme();
    const colorScheme = useColorScheme();
    const [loadingRepos, setLoadingRepos] = useState(false);
    const [repoData, setRepoData] = useState([]);
    const navigation = useNavigation();

    const themeContainerStyle =
        colorScheme === 'light' ? styles.lightContainer : styles.darkContainer;
    const themeTextStyle =
        colorScheme === 'light' ? styles.lightText : styles.darkText;
    const themeTitleContainer =
        colorScheme === 'light' ? styles.lightTitleContainer : styles.darkTitleContainer;
    const themeActivityIndicator =
        colorScheme === 'light' ? 'black' : 'white';

    React.useEffect(() => {
        async function fetchUserRepos() {
            setLoadingRepos(true);

            const token = await SecureStore.getItemAsync('github_token');

            const url = 'https://api.github.com/user/repos'
            
            const headers = new Headers({
                'Authorization': 'Token ' + token
            })
    
            await fetch(url, { method: 'GET', headers: headers })
                .then(res => res.json())
                .then(data => setRepoData(data))
                .catch(err => console.log(err))

            setLoadingRepos(false);
        }
        fetchUserRepos()
    }, []);

    return (
        <SafeAreaView style={[styles.container, themeContainerStyle]}>
            <ScrollView>
                <DisplayRepoInfo
                    title={'Create a new repo'}
                    onPress={() => navigation.navigate('Home')}
                    description={'Start a new repository for your notes from scratch'}
                    privateRepo={false}
                />

                <View style={[styles.titleContainer, themeTitleContainer]}>
                    <Text style={[styles.title, themeTextStyle]}>
                        Existing repos
                    </Text>
                </View>
                {
                    loadingRepos ?
                        <View style={styles.activityContainer}>
                            <ActivityIndicator color={themeActivityIndicator} size={40}/>
                        </View>
                        :
                        repoData.map((repo: any) => {
                            return (
                                <View key={repo.id}>
                                    <DisplayRepoInfo
                                        title={repo.name}
                                        onPress={() => navigation.navigate('Home')}
                                        description={repo.description}
                                        privateRepo={repo.private}
                                    />
                                </View>
                            )
                        })
                }
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 30,
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
    title: {
        fontSize: 20,
    },
    lightTitleContainer: {
        borderColor: '#d3d3d3',
    },
    darkTitleContainer: {
        borderColor: 'white',
    },
    titleContainer: {
        flexDirection: 'row',
        paddingBottom: 20,
        paddingLeft: 10,
        paddingTop: 20,
        marginBottom: 30,
        borderBottomWidth: 1,
    },
    activityContainer: {
        paddingTop: 40, 
        justifyContent: 'center', 
        alignItems: 'center'
    }
});

export default RepoSelectScreen;
