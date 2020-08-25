import React, { useState, FunctionComponent } from 'react';
import { SafeAreaView, StyleSheet, TextInput, View, Text } from 'react-native';
import { Appearance, useColorScheme } from 'react-native-appearance';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';

type RootStackParamList = {
    Home: undefined;
    CreateNoteScreen: {
        passedTitle?: string,
        passedContent: string,
        isNewNote: boolean,
    };
    Feed: { sort: 'latest' | 'top' } | undefined;
};

type Props = BottomTabNavigationProp<RootStackParamList, 'CreateNoteScreen'>;


export function CreateNoteScreen({ route }: Props) {


    Appearance.getColorScheme();
    const colorScheme = useColorScheme();
    const [content, setContent] = useState(route.params.passedContent);
    const [title, setTitle] = useState(route.params.passedTitle);
    // const navigation = useNavigation();

    const themeContainerStyle =
        colorScheme === 'light' ? styles.lightContainer : styles.darkContainer;
    const themeTextStyle =
        colorScheme === 'light' ? styles.lightText : styles.darkText;
    const themeTitleStyle =
        colorScheme === 'light' ? styles.lightTitle : styles.darkTitle;
    const themeTitleContainer =
        colorScheme === 'light' ? styles.lightTitleContainer : styles.darkTitleContainer;

    return (
        <SafeAreaView style={[styles.container, themeContainerStyle]}>

            <View style={[styles.titleContainer, themeTitleContainer]}>
                <TextInput
                    value={title}
                    placeholder="Title"
                    style={[styles.title, themeTitleStyle]}
                    onChangeText={(value) => setTitle(value)}
                />
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
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
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
        paddingBottom: 15,
        paddingTop: 25,
        alignItems: 'stretch'
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