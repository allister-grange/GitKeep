import React, { useState } from 'react';
import { Text, SafeAreaView, StatusBar, StyleSheet, TextInput } from 'react-native';
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

const EditNoteScreen = () => {

    Appearance.getColorScheme();
    const colorScheme = useColorScheme();
    const [text, setText] = useState(markdown);

    const themeContainerStyle =
        colorScheme === 'light' ? styles.lightContainer : styles.darkContainer;

    console.log(colorScheme)

    return (
        <SafeAreaView style={[styles.container, themeContainerStyle]}>
            <TextInput 
                  value={text}
                  multiline = {true}
                  onChangeText={(value) => setText(value)}
                    />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
        paddingTop: 30,
    },
    lightContainer: {
        backgroundColor: 'white'
    },
    darkContainer: {
        backgroundColor: 'black'
    }
});

export default EditNoteScreen;