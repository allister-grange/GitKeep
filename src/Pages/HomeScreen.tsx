import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { Text, SafeAreaView, Animated, StatusBar, StyleSheet, ScrollView, View, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { Appearance, useColorScheme } from 'react-native-appearance';
import { Note } from '../Components/Notes/Note';
import * as SecureStore from 'expo-secure-store';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useIsFocused } from '@react-navigation/native';
import { parseRepoData, FileData, getRepoContentsFromTree, updateFileContent, deleteFile, createNewNote } from '../Services/GitHub';
import Toast from "react-native-fast-toast";
import SearchComponent from '../Components/Search/SearchBar';

const HomeScreen = () => {

  Appearance.getColorScheme();
  const colorScheme = useColorScheme();
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const toast = useRef(null);

  const [scrollYValue, setScrollYValue] = useState(new Animated.Value(0));
  const [files, setFiles] = useState(new Array<FileData>());
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [displayingAllFiles, setDisplayingAllFiles] = useState(true);

  const clampedScroll = Animated.diffClamp(
    Animated.add(
      scrollYValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
        extrapolateLeft: 'clamp',
      }),
      new Animated.Value(0),
    ),
    0,
    80,
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await getRepoData();
    setRefreshing(false);
  };

  const themeStatusBarStyle =
    colorScheme === 'light' ? 'dark-content' : 'light-content';
  const themeContainerStyle =
    colorScheme === 'light' ? styles.lightContainer : styles.darkContainer;
  const themeNewNoteButtonStyle =
    colorScheme === 'light' ? styles.lightThemeNewNoteButton : styles.darkThemeNewNoteButton;
  const themeTextStyle =
    colorScheme === 'light' ? styles.lightText : styles.darkText;

  useEffect(() => {

    async function pullDownFiles() {

      if (!await SecureStore.getItemAsync('github_token'))
        navigation.navigate('AuthScreen')

      if (!await SecureStore.getItemAsync('repo_name'))
        navigation.navigate('RepoSelectScreen')

      if (files.length === 0) {
        setLoadingNotes(true);
        await getRepoData();
        setLoadingNotes(false);
      }
    }

    if (isFocused)
      pullDownFiles();

  }, [isFocused]);

  const getRepoData = async () => {
    let startTimeM = new Date().getTime()
    await getRepoContentsFromTree()
      .then(files => setFiles(files))
      .catch(err => alert(err));
    let durationM = new Date().getTime() - startTimeM
    console.log(durationM);
  }

  const generalToast = (message: string) => {
    toast.current.show(message, {});
  }

  const errorToast = (message: string) => {
    toast.current.show(message, {
      type: "warning",
    });
  }

  const successToast = (message: string) => {
    toast.current.show(message, {
      type: "success",
    });
  }

  const saveNewNote = async (content: string, title: string) => {
    generalToast("Saving your note");

    await createNewNote(content, title)
      .then(data => successToast("Saved you note ✔"))
      .catch(error => errorToast("Error on loading notes"));
    await getRepoData();

  }

  const refreshNotes = async (originalFile: FileData, newFile: string) => {
    generalToast("Saving your notes");

    await updateFileContent(originalFile, newFile)
      .then(data => successToast("Notes saved ✔"))
      .catch(error => errorToast("Error on loading notes"));
    await getRepoData();

  }

  const deleteNote = async (file: FileData) => {
    generalToast("Deleting Note");

    await deleteFile(file)
      .then(data => {
        successToast("Note deleted ✔");
        getRepoData();
      }
      )
      .catch(error => {
        errorToast("Failed to delete note :(");
        console.log(error)
      });
  }

  const changeSearchTerm = (searchTerm: string) => {

    if(searchTerm === ""){
      setDisplayingAllFiles(true)
      return
    }
    
    let foundFiles = new Array<FileData>();
    files.map(file => {
      file.isDisplaying = file.fileContent.indexOf(searchTerm) !== -1;
      foundFiles.push(file)
    })
    
    setFiles(foundFiles)
    setDisplayingAllFiles(false)
  }

  return (
    <SafeAreaView style={[styles.container, themeContainerStyle]}>
      <StatusBar barStyle={themeStatusBarStyle} />
      {/* <Animated.View style={{zIndex: 1, justifyContent: 'center'}}> */}
      <SearchComponent changeSearchTerm={changeSearchTerm} clampedScroll={clampedScroll} />
      {/* </Animated.View> */}
      {
        loadingNotes ?
          <ActivityIndicator color={'coral'} size={40} />
          :
          <Animated.ScrollView
            style={styles.notesContatiner}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollYValue } } }],
              { useNativeDriver: true },
              // () => { },          // Optional async listener
            )}
            contentInsetAdjustmentBehavior="automatic"
            refreshControl={
              <RefreshControl style={{
                zIndex: 99,
                position: 'absolute',
                elevation: 2,
              }} refreshing={refreshing} onRefresh={onRefresh} />
            }>
            {
              files.length >= 1 ?
                files.map((file, idx) => 
                  {
                    if(displayingAllFiles)
                      return <Note refreshNotes={refreshNotes} deleteNote={deleteNote} key={idx} file={file} />
                    else if(file.isDisplaying) 
                      return <Note refreshNotes={refreshNotes} deleteNote={deleteNote} key={idx} file={file} />
                  }
                )
                :
                <View style={styles.emptyRepoContainer}>
                  <Text style={[styles.emptyRepoText, themeTextStyle]}>there are no .md notes in this repo,</Text>
                  <Text style={[styles.emptyRepoText, themeTextStyle]}>make one!</Text>
                </View>
            }
          </Animated.ScrollView>
      }
      <View style={styles.newNoteButtonContainer}>
        <TouchableOpacity style={[styles.newNoteButton, themeNewNoteButtonStyle]}
          onPress={() => navigation.navigate('CreateNoteScreen', { saveNewNote: saveNewNote })} >
          <Ionicons outline={false} name={'md-add'} size={35} color={'orange'} />
        </TouchableOpacity>
      </View>
      <Toast ref={toast} />

    </SafeAreaView>
  );
}

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
    height: '100%'
  },
  newNoteButton: {
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowRadius: 3,
    elevation: 7,
    shadowOffset: { width: 1, height: 3 },
    shadowColor: 'grey',
    shadowOpacity: 0.8,
  },
  lightThemeNewNoteButton: {
    backgroundColor: 'white',
  },
  darkThemeNewNoteButton: {
    backgroundColor: '#303030',
  },
  lightText: {
    color: 'black'
  },
  darkText: {
    color: 'white'
  },
  newNoteButtonContainer: {
    bottom: '3%',
    right: '7%',
    alignSelf: 'center',
    height: '10%',
    position: 'absolute',
  },
  emptyRepoText: {
    alignSelf: 'center',
  },
  emptyRepoContainer: {
    paddingTop: '90%'
  }
});
