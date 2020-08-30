import React, { useState, FunctionComponent, useEffect } from 'react';
import { KeyboardAvoidingView, StyleSheet, TextInput, View, Text } from 'react-native';
import { Appearance, useColorScheme } from 'react-native-appearance';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useIsFocused } from '@react-navigation/native';
import Markdown from 'react-native-showdown';
import { FileData, updateFileContent } from '../Services/GitHub';

type RootStackParamList = {
    Home: undefined;
    CreateNoteScreen: {
        passedTitle?: string,
        file: FileData,
        isNewNote: boolean,
        refreshNotes: () => {}
    };
    Feed: { sort: 'latest' | 'top' } | undefined;
};

type Props = BottomTabNavigationProp<RootStackParamList, 'CreateNoteScreen'>;

export function CreateNoteScreen({ route }: Props) {

    Appearance.getColorScheme();
    const colorScheme = useColorScheme();
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");
    const isFocused = useIsFocused();

    useEffect(() => {

        //this means the content was edited by the user, so refresh it in git, todo add a toast below
        async function pushNoteToGit() {

            if (!route.params.file.fileContent)
                return;

            if (content !== "" && content !== route.params.file.fileContent) {
                await updateFileContent(route.params.file, content)
                    .then(data => data)
                    .catch(error => console.log(error));
                route.params.refreshNotes();
            }
        }

        pushNoteToGit();

        console.log("hello + " + JSON.stringify(route.params.file));
        

        if (!isFocused) {
            setContent("");
        }
        else {
            setContent(route.params.file.fileContent);
        }

    }, [isFocused])

    const themeContainerStyle =
        colorScheme === 'light' ? styles.lightContainer : styles.darkContainer;
    const themeTextStyle =
        colorScheme === 'light' ? styles.lightText : styles.darkText;
    const themeTitleStyle =
        colorScheme === 'light' ? styles.lightTitle : styles.darkTitle;
    const themeTitleContainer =
        colorScheme === 'light' ? styles.lightTitleContainer : styles.darkTitleContainer;

    return (
        <KeyboardAvoidingView style={[styles.container, themeContainerStyle]}>
            <View style={[styles.titleContainer, themeTitleContainer]}>
                <Text style={[styles.title, themeTitleStyle]}>{route.params.file.fileInfo.path}</Text>
            </View>
            <View style={styles.contentContainer}>
                <TextInput
                    value={content}
                    placeholder="Content"
                    multiline={true}
                    style={[styles.textInput, themeTextStyle]}
                    onChangeText={(value) => setContent(value)}
                />
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingBottom: 40,
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
    contentContainer: {
        width: '90%',
        paddingBottom: 50,
        paddingTop: 25,
        height: '100%'
    },
    title: {
        fontSize: 30
    },
    lightTitle: {
        color: 'black',
    },
    darkTitle: {
        color: 'white'
    },
    textInput: {
        fontSize: 15
    },
});

export default CreateNoteScreen;