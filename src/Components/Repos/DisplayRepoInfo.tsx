import React, { FunctionComponent } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Appearance, useColorScheme } from 'react-native-appearance'
import { useNavigation } from '@react-navigation/native';
import RepoSelectScreen from '../../Pages/RepoSelectScreen';

type PassedProps = {
    title: string,
    onPress: () => void,
    description: string | null,
    privateRepo: boolean,
  };

export const DisplayRepoInfo: FunctionComponent<PassedProps> = ({ title, onPress, description, privateRepo }) => {

    Appearance.getColorScheme();
    const colorScheme = useColorScheme();
    const navigation = useNavigation();

    const themeContainerStyle =
        colorScheme === 'light' ? styles.lightContainer : styles.darkContainer;
    const themeTextStyle =
        colorScheme === 'light' ? styles.lightThemeText : styles.darkThemeText;
    const themeTitleTextStyle =
        colorScheme === 'light' ? styles.lightTitleText : styles.darkTitleText;

    return (
        <View style={[styles.container, themeContainerStyle]}>
            <TouchableOpacity
                onPress={() => navigation.navigate('EditNoteScreen')
                }
            >
                <Text style={[styles.text, themeTitleTextStyle]}>{title}</Text>
                <Text style={[styles.text, themeTextStyle]}>{description ? description : "No description for this repo."}</Text>
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
        alignSelf: 'flex-start',
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
