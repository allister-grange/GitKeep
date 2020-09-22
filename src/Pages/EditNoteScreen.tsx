import React, { useState, useEffect, useRef } from 'react';
import { KeyboardAvoidingView, StyleSheet, TextInput, View, Text, Platform, Alert, SafeAreaView } from 'react-native';
import { Appearance, useColorScheme } from 'react-native-appearance';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useIsFocused } from '@react-navigation/native';
// import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import Markdown from 'react-native-showdown';
import { FileData, updateFileContent, deleteFile } from '../Services/GitHub';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { MenuProvider, Menu, MenuTrigger, MenuOptions, MenuOption } from 'react-native-popup-menu';
import Toast from "react-native-fast-toast";
import { useNavigation } from '@react-navigation/native';

type RootStackParamList = {
    Home: undefined;
    EditNoteScreen: {
        file: FileData,
        refreshNotes: (originalFile: FileData, newFile: string) => {},
        deleteNote: (file: FileData) => {}
    };
    Feed: { sort: 'latest' | 'top' } | undefined;
};

type Props = BottomTabNavigationProp<RootStackParamList, 'EditNoteScreen'>;

export function EditNoteScreen({ route }: Props) {

    Appearance.getColorScheme();
    const colorScheme = useColorScheme();
    const [content, setContent] = useState("");
    const isFocused = useIsFocused();
    const toast = useRef(null);
    const navigation = useNavigation();

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

    const DeleteAlert = () =>
        Alert.alert(
            "Delete Note",
            "Are you sure you want to delete this note? It is stored in git so it will be recoverable.",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel pressed"),
                    style: "cancel"
                },
                {
                    text: "Delete", onPress: () => {
                        route.params.deleteNote(route.params.file);
                        navigation.navigate('Home');
                    }
                }
            ],
            { cancelable: false }
        );


    useEffect(() => {

        //todo potentially think of a better way to do this 
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
        else if (route.params.file) {
            setContent(route.params.file.fileContent);
        }

    }, [isFocused])

    const saveChangesToRepo = async () => {
        //if the file has been edited since it was passed in
        if (content !== "" && content !== route.params.file.fileContent) {
            console.log("here");
            console.log(toast);

            toast.current.show("Saving your notes", {});
            await updateFileContent(route.params.file, content)
                //todo verify the save was succesful
                .then(data => {
                    route.params.file.fileContent = content
                    toast.current.show("Note saved ✔", {
                        type: "success",

                    })
                })
                .catch(error => toast.current.show("Error on saving note ✘", {
                    type: "danger",
                }));
        }
        else {
            alert("No file changes");
        }
    }

    // const deleteNote = async () => {
    //     alert("You sure dog?")
    // }

    return (
        <MenuProvider>
            <SafeAreaView style={[styles.container, themeContainerStyle]}>
                <View style={[styles.titleContainer, themeTitleContainer]}>
                    <View style={{ flex: 1 }}>
                        <Text style={[styles.title, themeTitleStyle]}>{route.params.file.fileInfo.path}</Text>
                    </View>
                    <Menu>
                        <MenuTrigger>
                            <AntDesign style={styles.ellipses} name="ellipsis1" size={24} color={ellipsesColor} />
                        </MenuTrigger>
                        <MenuOptions customStyles={{ optionsContainer: menuContainerStyle }}>
                            <MenuOption onSelect={() => saveChangesToRepo()}>
                                <Text style={[styles.menuText, themeTextStyle]}>Save</Text>
                            </MenuOption>
                            <MenuOption onSelect={() => DeleteAlert()} >
                                <Text style={[styles.menuText, themeTextStyle]}>Delete</Text>
                            </MenuOption>
                            <MenuOption onSelect={() => alert(`Not called`)}>
                                <Text style={[styles.menuText, themeTextStyle]}>Rename</Text>
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

export default EditNoteScreen;