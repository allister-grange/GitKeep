import React, { useState } from 'react';
import { Text, SafeAreaView, StatusBar, StyleSheet, TextInput, View, ScrollView, ActivityIndicator, Button } from 'react-native';
import { Appearance, useColorScheme } from 'react-native-appearance';
import { DisplayRepoInfo } from '../Components/Repos/DisplayRepoInfo';
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import { fetchUserRepos } from '../Services/GitHub';
import { TouchableOpacity } from 'react-native-gesture-handler';

const CreateNewRepoScreen = () => {

    Appearance.getColorScheme();
    const colorScheme = useColorScheme();
    const [repoName, setRepoName] = useState("");
    const navigation = useNavigation();

    const themeContainerStyle =
        colorScheme === 'light' ? styles.lightContainer : styles.darkContainer;
    const themeTextStyle =
        colorScheme === 'light' ? styles.lightText : styles.darkText;
    const themeTitleContainer =
        colorScheme === 'light' ? styles.lightTitleContainer : styles.darkTitleContainer;
    const themeButtonContainer =
        colorScheme === 'light' ? styles.lightButtonContainer : styles.darkButtonContainer;
    const themePlaceHolderStyle =
        colorScheme === 'light' ? '#505050' : '#C7C7C7';
    const themeButtonColor =
        colorScheme === 'light' ? 'black' : 'white';

    const createNewRepo = async () => {
        //craete new repo in gut hub

        await SecureStore.setItemAsync('repo_name', repoName);
        navigation.navigate('Home')
    }

    return (
        <SafeAreaView style={[styles.container, themeContainerStyle]}>
            <Text style={[styles.title, themeTextStyle]}>Create a new repo</Text>
            <TextInput
                value={repoName}
                placeholder="repo name"
                placeholderTextColor={themePlaceHolderStyle}
                multiline={true}
                style={[styles.input, themeTitleContainer, themeTextStyle]}
                onChangeText={(value) => setRepoName(value)}
            />
            {
                repoName !== "" && 
                <TouchableOpacity 
                    onPress={createNewRepo}
                    style={[styles.buttonContainer, themeButtonContainer]}
                    accessibilityLabel="Create a new repo with this name"
                >
                    <Text style={[themeTextStyle]}>create repo</Text>
                </TouchableOpacity>
            }
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },
    input: {
        fontSize: 20,
        borderWidth: 2,
        borderRadius: 5,
        margin: 20,
        padding: 10,
        width: '50%'
    },
    lightText: {
        color: 'black'
    },
    darkText: {
        color: 'white'
    },
    title: {
        fontSize: 30,
        paddingTop: '50%'
    },
    lightTitleContainer: {
        borderColor: '#d3d3d3',
    },
    darkTitleContainer: {
        borderColor: 'white',
    },
    lightContainer: {
        backgroundColor: 'white'
    },
    darkContainer: {
        backgroundColor: '#202020'
    },
    buttonContainer: {
        borderWidth: 2,
        padding: 10,
        borderRadius: 5
    },
    lightButtonContainer: {
        borderColor: '#d3d3d3',
    },
    darkButtonContainer: {
        borderColor: 'white',
    }
});

export default CreateNewRepoScreen;
