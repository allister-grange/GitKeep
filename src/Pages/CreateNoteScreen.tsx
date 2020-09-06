import React, { useState, FunctionComponent, useEffect } from 'react';
import { KeyboardAvoidingView, StyleSheet, TextInput, View, Text, ActivityIndicator, Alert } from 'react-native';
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
    const [saving, setSaving] = useState(false);
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

    const saveChangesToRepo = async () => {
        //if the file has been edited since it was passed in
        if (content !== "" && content !== route.params.file.fileContent) {
            setSaving(true)
            await updateFileContent(route.params.file, content)
                //todo verify the save was succesful
                .then(data => route.params.file.fileContent = content)
                .catch(error => console.log(error));
            
            setSaving(false)
        }
        else{
            alert("No file changes");
        }

    }

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
                        <MenuOptions customStyles={{ optionsContainer: menuContainerStyle }}>
                            <MenuOption onSelect={() => saveChangesToRepo()}>
                                <Text style={[styles.menuText, themeTextStyle]}>Save</Text>
                            </MenuOption>
                            <MenuOption onSelect={() => alert(`Delete`)} >
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
            </KeyboardAvoidingView>
            {saving &&
                <View style={styles.loadingIndicator}>
                    <ActivityIndicator size='large' color={ellipsesColor} />
                </View>
            }
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
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    }

});

export default CreateNoteScreen;