import React from 'react';
import { Text, SafeAreaView, StatusBar, StyleSheet, ScrollView, View } from 'react-native';
import { Appearance, useColorScheme } from 'react-native-appearance';
import { Note } from '../Components/Notes/Note';
import Markdown from 'react-native-showdown';

const markdown = `
# Todo

## Architectural Spike MVP

Authentication  
Storing words in a database associated with user accounts - GUID?
Search  
I want to create a user using some curl command for learning purposes  
Search for a word and it gets stored in the database

## Authentication

Got a single user working, good enough for MVP!

In the future, need to hook up a database to store users.  Also, need to use DTO's.


## Database

MVP:  
Store a searched word with a user ID attached to it

## Mobile App

Loggin in (screw registering)

## Other stuff

Authentication  
Storing words in a database associated with user accounts - GUID?
Search  
I want to create a user using some curl command for learning purposes  
Search for a word and it gets stored in the database

`;

  const css = `
// h1 { color: red; }
code { font-size: 1.2rem; background-color: lightgray; }
`;

const EditNoteScreen = () => {

    Appearance.getColorScheme();
    const colorScheme = useColorScheme();

    const themeContainerStyle =
        colorScheme === 'light' ? styles.lightContainer : styles.darkContainer;

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
        padding: 15,
    },
    lightContainer: {
        backgroundColor: 'white'
    },
    darkContainer: {
        backgroundColor: 'black'
    }
});

export default EditNoteScreen;