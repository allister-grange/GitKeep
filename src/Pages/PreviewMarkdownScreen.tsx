import React, { FunctionComponent } from 'react';
import { Text, SafeAreaView, StyleSheet, ScrollView, View } from 'react-native';
import { Appearance, useColorScheme } from 'react-native-appearance';
import { Note } from '../Components/Notes/Note';
import Markdown from 'react-native-showdown';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
    Home: undefined;
    PreviewMarkdownScreen: {
        css: string,
        markdown: string,
    };
    Feed: { sort: 'latest' | 'top' } | undefined;
};

type Props = StackNavigationProp<RootStackParamList, 'PreviewMarkdownScreen'>;

export function PreviewMarkdownScreen({ route }: Props) {

    Appearance.getColorScheme();
    const colorScheme = useColorScheme();

    const themeContainerStyle =
        colorScheme === 'light' ? styles.lightContainer : styles.darkContainer;

    return (
        <SafeAreaView style={[styles.container, themeContainerStyle]}>
            <Markdown markdown={route.params.markdown} css={route.params.css} />
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
    }
});
