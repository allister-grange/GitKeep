import React from 'react';
import { Text, SafeAreaView, StatusBar, StyleSheet, ScrollView, View } from 'react-native';
import { Appearance, useColorScheme } from 'react-native-appearance';
import { Note } from '../Components/Notes/Note';
import Markdown from 'react-native-showdown';

const markdown = `
# Welcome to React Native Showdown!

To get started, edit the markdown in \`App.tsx\`.

| Column 1 | Column 2 |
|----------|----------|
| A1       | B1       |
| A2       | B2       |
`;

  const css = `
h1 { color: red; }
code { font-size: 1.2rem; background-color: lightgray; }
`;

const EditNoteScreen = () => {


    Appearance.getColorScheme();
    const colorScheme = useColorScheme();

    const themeStatusBarStyle =
        colorScheme === 'light' ? 'dark-content' : 'light-content';
    const themeContainerStyle =
        colorScheme === 'light' ? styles.lightContainer : styles.darkContainer;
    const themeTextStyle =
        colorScheme === 'light' ? styles.lightThemeText : styles.darkThemeText;

    console.log(colorScheme)

    return (
        <SafeAreaView style={[styles.container, themeContainerStyle]}>
            <Markdown markdown={markdown} css={css} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,

    },
    lightContainer: {
        backgroundColor: '#fff',
    },
    darkContainer: {
        backgroundColor: '#242C40',
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
    }
});

export default EditNoteScreen;