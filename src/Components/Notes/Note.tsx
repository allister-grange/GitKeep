import React, { FunctionComponent } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Appearance, useColorScheme } from 'react-native-appearance'
import { useNavigation } from '@react-navigation/native';
import Markdown from 'react-native-showdown';
import { css } from './light';

type PassedProps = {
    content: string,
    title?: string,
};


export const Note: FunctionComponent<PassedProps> = ({ content, title }) => {

    Appearance.getColorScheme();
    const colorScheme = useColorScheme();
    const navigation = useNavigation();

    const themeContainerStyle =
        colorScheme === 'light' ? styles.lightContainer : styles.darkContainer;
    const themeTextStyle =
        colorScheme === 'light' ? styles.lightThemeText : styles.darkThemeText;
    const themeTitleTextStyle =
        colorScheme === 'light' ? styles.lightTitleText : styles.darkTitleText;

    const truncateContent = (text: string): string => {
        let cutdownContent = text.substr(0, 100);
        if (/^\S/.test(text.substr(100)))
            return cutdownContent.replace(/\s+\S*$/, "") + '...';

        return cutdownContent;
    }

    const heightOfNote = content.length > 400 ? 400 : content.length + 20;

    return (
        <View style={[styles.container, themeContainerStyle]}>
            <TouchableOpacity
                onPress={() => navigation.navigate('CreateNoteScreen',
                    {
                        passedContent: content,
                        passedTitle: title,
                        isNewNote: false
                    })}
            >
                {/* <Text style={[styles.text, themeTitleTextStyle]}>Title</Text> */}
                {/* <Text style={[styles.text, themeTextStyle]}>{truncateContent(content)}</Text> */}
                <View style={{height: heightOfNote}}>
                    <Markdown showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator ={false} markdown={content} css={css} />
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
        // elevation: 0.2,
    },
    lightContainer: {
        borderColor: '#d3d3d3',
    },
    darkContainer: {
        borderColor: 'white',
    },
    lightTitleText: {
        fontWeight: "600",
        fontSize: 17,
        color: 'black'
    },
    darkTitleText: {
        fontWeight: "600",
        fontSize: 17,
        color: 'white'
    },
    text: {
        textAlign: 'left',
    },
    lightThemeText: {
        paddingTop: 10,
        color: 'grey',
    },
    darkThemeText: {
        paddingTop: 10,
        color: 'white'
    },

});
