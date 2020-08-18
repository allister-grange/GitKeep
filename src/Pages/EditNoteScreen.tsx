import React from 'react';
import { Text, SafeAreaView, StatusBar, StyleSheet, ScrollView, View } from 'react-native';
import { Appearance, useColorScheme } from 'react-native-appearance';
import { Note } from '../Components/Notes/Note';


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
           <Text>Yoza</Text>
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