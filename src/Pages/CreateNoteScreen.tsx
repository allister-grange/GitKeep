import React, { useState, useEffect, useRef } from 'react';
import { KeyboardAvoidingView, StyleSheet, TextInput, View, Text, Platform, Alert, SafeAreaView } from 'react-native';
import { Appearance, useColorScheme } from 'react-native-appearance';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useIsFocused } from '@react-navigation/native';
// import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import Markdown from 'react-native-showdown';
import { FileData, createNewNote } from '../Services/GitHub';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { MenuProvider, Menu, MenuTrigger, MenuOptions, MenuOption } from 'react-native-popup-menu';
import Toast from "react-native-fast-toast";
import { useNavigation } from '@react-navigation/native';

type RootStackParamList = {
    Home: undefined;
    CreateNoteScreen: {
        saveNewNote: (content: string, title: string) => {},
    };
    Feed: { sort: 'latest' | 'top' } | undefined;
};

type Props = BottomTabNavigationProp<RootStackParamList, 'CreateNoteScreen'>;

export function CreateNoteScreen({ route }: Props) {

    Appearance.getColorScheme();
    const colorScheme = useColorScheme();
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");
    const [savedContent, setSavedContent] = useState("");
    const toast = useRef(null);
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

        //todo potentially think of a better way to do this 
        async function pushNoteToGit() {
            if (content !== "" && title !== "" && savedContent !== content) {
                route.params.saveNewNote(content, title)
            }
        }

        pushNoteToGit();

        if (!isFocused) {
            setContent("");
            setTitle("");
            setSavedContent("");
        }

    }, [isFocused])

    const savingToast = (message: string) => {
        toast.current.show(message, {});
    }

    const successToast = (message: string) => {
        toast.current.show(message, {
            type: "success",
        });
    }

    const errorToast = (message: string) => {
        toast.current.show(message, {
            type: "danger",
        });
    }

    const saveChangesToRepo = async () => {
        //if the file has been edited since it was passed in
        if (content !== "" && title !== "") {
            savingToast("Saving your notes");
            await createNewNote(content, title)
                .then(data => {
                    successToast("Note saved ✔");
                    setSavedContent(content);
                })
                .catch(error => {
                    console.log(error);
                    errorToast("Error on saving note ✘");
                });
        }
        else {
            alert("No file changes");
        }
    }

    return (
        <MenuProvider>
            <SafeAreaView style={[styles.container, themeContainerStyle]}>
                <View style={[styles.titleContainer, themeTitleContainer]}>
                    <View style={{ flex: 1 }}>
                        <TextInput
                            value={title}
                            placeholder="File Title"
                            multiline={true}
                            style={[styles.title, themeTitleStyle]}
                            onChangeText={(value) => setTitle(value)}
                        />
                    </View>
                    <Menu>
                        <MenuTrigger>
                            <AntDesign style={styles.ellipses} name="ellipsis1" size={24} color={ellipsesColor} />
                        </MenuTrigger>
                        <MenuOptions customStyles={{ optionsContainer: menuContainerStyle }}>
                            <MenuOption onSelect={() => saveChangesToRepo()}>
                                <Text style={[styles.menuText, themeTextStyle]}>Save</Text>
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
            </SafeAreaView>
            <Toast ref={toast} />
        </MenuProvider >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingBottom: 40,
    },
    isSavingContainer: {
        flex: 1,
        alignItems: 'center',
        paddingBottom: 40,
        opacity: 0.9
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
        paddingTop: Platform.OS === 'android' ? 25 : 0,
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
    menuText: {
        fontSize: 20
    },
    ellipses: {
        transform: [{ rotate: '90deg' }],
    },
    loadingIndicator: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 230,
        alignItems: 'center',
        justifyContent: 'center'
    }

});

export default CreateNoteScreen;