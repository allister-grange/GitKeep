import React, { FunctionComponent, useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { Appearance, useColorScheme } from 'react-native-appearance'
import { useNavigation } from '@react-navigation/native';
import Markdown from 'react-native-showdown';
import { darkCss } from './dark';
import { lightCss } from './light';
import { FileData } from '../../Services/GitHub';
import { YellowBox } from 'react-native';
import { WebViewMessageEvent } from 'react-native-webview';
import { generateRandomAsync } from 'expo-auth-session/build/PKCE';

YellowBox.ignoreWarnings([
    'Non-serializable values were found in the navigation state',
]);

type PassedProps = {
    file: FileData,
    title?: string,
    refreshNotes: (originalFile: FileData, newFile: string) => {},
};


export const Note: FunctionComponent<PassedProps> = ({ file, title, refreshNotes }) => {

    Appearance.getColorScheme();
    const colorScheme = useColorScheme();
    const navigation = useNavigation();
    const [heightOfNote, setHeightOfNote] = useState(0);

    const themeContainerStyle =
        colorScheme === 'light' ? styles.lightContainer : styles.darkContainer;
    const css =
        colorScheme === 'light' ? lightCss : darkCss;

    const fileContent = file.fileContent;

    useEffect(() => {
        let random = Math.random() * 100 | 0;
        setHeightOfNote(fileContent.length > 400 ? 300 + random : 80 + random);
    }, [])

    return (
        <View
            style={[styles.container, themeContainerStyle, { height: heightOfNote }]}>
            <TouchableOpacity
                onLongPress={() => navigation.navigate('CreateNoteScreen',
                    {
                        refreshNotes: refreshNotes,
                        file: file,
                        passedTitle: title,
                        isNewNote: false
                    })}
                onPress={() => navigation.navigate('PreviewMarkdownScreen',
                    {
                        markdown: fileContent,
                        css: css,
                    })}
            >
                <View style={{ height: '100%' }}>
                    <Markdown showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        scalesPageToFit={true}
                        javaScriptEnabled={false}
                        markdown={fileContent} css={css} />
                </View>
            </TouchableOpacity>
        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        borderRadius: 8,
        borderWidth: 1,
        padding: 15,
        marginRight: 7,
        marginLeft: 7,
        marginTop: 4,
        marginBottom: 4,
    },
    lightContainer: {
        borderColor: '#d3d3d3',
    },
    darkContainer: {
        borderColor: 'white',
    }
});
