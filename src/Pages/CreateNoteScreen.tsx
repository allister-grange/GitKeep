import React, { useState, FunctionComponent, useEffect } from 'react';
import { KeyboardAvoidingView, StyleSheet, TextInput, View, Text } from 'react-native';
import { Appearance, useColorScheme } from 'react-native-appearance';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useIsFocused } from '@react-navigation/native';
// import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import Markdown from 'react-native-showdown';
import { FileData, updateFileContent } from '../Services/GitHub';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { MenuProvider, Menu, MenuTrigger, MenuOptions, MenuOption } from 'react-native-popup-menu';


type RootStackParamList = {
    Home: undefined;
    CreateNoteScreen: {
        passedTitle?: string,
        file: FileData,
        isNewNote: boolean,
        refreshNotes: (originalFile: FileData, newFile: string) => {}
    };
    Feed: { sort: 'latest' | 'top' } | undefined;
};

type Props = BottomTabNavigationProp<RootStackParamList, 'CreateNoteScreen'>;

export function CreateNoteScreen({ route }: Props) {

    Appearance.getColorScheme();
    const colorScheme = useColorScheme();
    const [content, setContent] = useState("");
    const [menuOpened, setMenuOpened] = useState(false);
    const isFocused = useIsFocused();

    const themeContainerStyle =
        colorScheme === 'light' ? styles.lightContainer : styles.darkContainer;
    const menuContainerStyle =
        colorScheme === 'light' ? styles.lightContainer : styles.darkMenuContainer;
    const themeTextStyle =
        colorScheme === 'light' ? styles.lightText : styles.darkText;
    const themeTitleStyle =
        colorScheme === 'light' ? styles.lightTitle : styles.darkTitle;
    const themeTitleContainer =
        colorScheme === 'light' ? styles.lightTitleContainer : styles.darkTitleContainer;
    const ellipsesColor =
        colorScheme === 'light' ? 'black' : 'white';


    useEffect(() => {

        //this means the content was edited by the user, so refresh it in git, todo add a toast below
        async function pushNoteToGit() {

            if (!route.params.file.fileContent)
                return;

            if (content !== "" && content !== route.params.file.fileContent) {
                route.params.refreshNotes(route.params.file, content);
            }
        }

        pushNoteToGit();

        if (!isFocused) {
            setContent("");
        }
        else {
            setContent(route.params.file.fileContent);
        }

    }, [isFocused])

    return (
        <MenuProvider>
            <KeyboardAvoidingView style={[styles.container, themeContainerStyle]}>
                <View style={[styles.titleContainer, themeTitleContainer]}>
                    <View style={{ flex: 1 }}>
                        <Text style={[styles.title, themeTitleStyle]}>{route.params.file.fileInfo.path}</Text>
                    </View>
                    <Menu>
                        <MenuTrigger>
                            <AntDesign style={styles.ellipses} name="ellipsis1" size={24} color={ellipsesColor} />
                        </MenuTrigger>
                        <MenuOptions customStyles={{optionsContainer: menuContainerStyle}}>
                            <MenuOption onSelect={() => alert(`Save`)}>
                                <Text style={[styles.textInput, themeTextStyle]}>Save</Text>
                            </MenuOption>
                            <MenuOption onSelect={() => alert(`Delete`)} >
                                <Text style={[styles.textInput, themeTextStyle]}>Delete</Text>
                            </MenuOption>
                            <MenuOption onSelect={() => alert(`Not called`)} disabled={true}>
                                <Text style={[styles.textInput, themeTextStyle]}>Disabled</Text>
                            </MenuOption>
                        </MenuOptions>
                    </Menu>
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
            </KeyboardAvoidingView>
        </MenuProvider >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingBottom: 40,
    },
    lightContainer: {
        backgroundColor: 'white'
    },
    darkContainer: {
        backgroundColor: '#202020'
    },
    darkMenuContainer: {
        backgroundColor: '#353535'
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
        flexDirection: 'row',
        alignItems: 'center',
    },
    lightTitleContainer: {
        borderColor: '#d3d3d3',
    },
    darkTitleContainer: {
        borderColor: 'white',
    },
    contentContainer: {
        width: '90%',
        paddingBottom: 50,
        paddingTop: 25,
        height: '100%'
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
    ellipses: {
        transform: [{ rotate: '90deg' }],
    }
});

export default CreateNoteScreen;