import React, { useState } from 'react';
import { Text, SafeAreaView, StyleSheet, TextInput, View, ScrollView, ActivityIndicator } from 'react-native';
import { Appearance, useColorScheme } from 'react-native-appearance';
import { Note } from '../Components/Notes/Note';
import Markdown from 'react-native-showdown';
import { DisplayRepoInfo } from '../Components/Repos/DisplayRepoInfo';
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import { fetchUserRepos } from '../Services/GitHub';

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

    React.useEffect(() => {
        async function fetchData() {
            setLoadingRepos(true);
            await fetchUserRepos()
                .then(data => setRepoData(data))
            setLoadingRepos(false);
        }

        fetchData()
    }, []);

    const selectRepo = async (repoName: string) => {        
        await SecureStore.setItemAsync('repo_name', repoName);
        navigation.navigate('Home');
    }

    return (
        <SafeAreaView style={[styles.container, themeContainerStyle]}>
            <ScrollView>
                <DisplayRepoInfo
                    title={'Create a new repo'}
                    onPress={() => navigation.navigate('CreateNewRepoScreen')}
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
                            <ActivityIndicator color={'coral'} size={40}/>
                        </View>
                        :
                        repoData.map((repo: any) => {
                            return (
                                <View key={repo.id}>
                                    <DisplayRepoInfo
                                        title={repo.name}
                                        onPress={() => selectRepo(repo.name)}
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
        paddingTop: 200,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default RepoSelectScreen;
