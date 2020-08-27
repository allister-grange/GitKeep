import React, { FunctionComponent } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Appearance, useColorScheme } from 'react-native-appearance'
import { useNavigation } from '@react-navigation/native';
import Markdown from 'react-native-showdown';
import { darkCss } from './dark';
import { lightCss } from './light';
import { FileData } from '../../Services/GitHub';

type PassedProps = {
    file: FileData,
    title?: string,
    refreshNotes: () => {},
};


export const Note: FunctionComponent<PassedProps> = ({ file, title, refreshNotes }) => {

    Appearance.getColorScheme();
    const colorScheme = useColorScheme();
    const navigation = useNavigation();

    const themeContainerStyle =
        colorScheme === 'light' ? styles.lightContainer : styles.darkContainer;
    const css =
        colorScheme === 'light' ? lightCss : darkCss;

    const fileContent = file.fileContent; 

    const heightOfNote = fileContent.length > 400 ? 400 : fileContent.length + 20;

    return (
        <View style={[styles.container, themeContainerStyle]}>
            <TouchableOpacity
                onPress={() => navigation.navigate('CreateNoteScreen',
                    {
                        refreshNotes: refreshNotes,
                        file: file,
                        passedTitle: title,
                        isNewNote: false
                    })}
            >
                <View style={{ height: heightOfNote }}>
                    <Markdown showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        markdown={fileContent} css={css} />
                </View>
            </TouchableOpacity>
        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    },
});
