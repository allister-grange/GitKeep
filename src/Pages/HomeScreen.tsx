import React, { useEffect, useState } from 'react';
import { Text, SafeAreaView, StatusBar, StyleSheet, ScrollView, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Appearance, useColorScheme } from 'react-native-appearance';
import { Note } from '../Components/Notes/Note';
import * as SecureStore from 'expo-secure-store';
import * as FileSystem from 'expo-file-system';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useIsFocused } from '@react-navigation/native';
import { Buffer } from 'buffer'
import { getFileContentOfUrl, fetchRepoContents } from '../Services/GitHub';

const HomeScreen = () => {

  Appearance.getColorScheme();
  const colorScheme = useColorScheme();
  const navigation = useNavigation();
  Appearance.getColorScheme();
  const [files, setFiles] = useState(new Array<string>());
  const [loadingNotes, setLoadingNotes] = useState(false);

  const themeStatusBarStyle =
    colorScheme === 'light' ? 'dark-content' : 'light-content';
  const themeContainerStyle =
    colorScheme === 'light' ? styles.lightContainer : styles.darkContainer;
  const themeNewNoteButtonStyle =
    colorScheme === 'light' ? styles.lightThemeNewNoteButton : styles.darkThemeNewNoteButton;
  const themeActivityIndicator =
    colorScheme === 'light' ? 'black' : 'white';

  const parseRepoData = async (data: any): Promise<any> => {
    let urlsOfFilesToDownload: Array<string> = new Array<string>();
    
    data.forEach((file: any) => {
      //add in check for markdown here 
      if (file.type !== 'dir') {
        urlsOfFilesToDownload.push(file.url);
      }
    });

    let contentOfFilesArray = new Array<string>();

    for (let url in urlsOfFilesToDownload) {
      await getFileContentOfUrl(urlsOfFilesToDownload[url])
        .then(fileContent => (contentOfFilesArray.push(fileContent)))
    }
    
    return contentOfFilesArray;
  }

  React.useEffect(() => {

    async function pullDownFiles() {
      setLoadingNotes(true);
      await fetchRepoContents()
        .then(data => parseRepoData(data))
        .then(files => setFiles(files))
        .catch(err => alert(err));
      setLoadingNotes(false);
    }

    pullDownFiles();
  }, []);

  return (
    <SafeAreaView style={[styles.container, themeContainerStyle]}>
      <StatusBar barStyle={themeStatusBarStyle} />
      {
        loadingNotes ?
          <ActivityIndicator color={themeActivityIndicator} size={40} />
          :
          <ScrollView style={styles.notesContatiner}>
            {
              files.map((file, idx) => (
                <Note key={idx} content={file} />
              ))
            }
          </ScrollView>

      }

      <View style={styles.newNoteButtonContainer}>
        <TouchableOpacity style={[styles.newNoteButton, themeNewNoteButtonStyle]} onPress={() => navigation.navigate('CreateNoteScreen')}>
          <Ionicons outline={false} name={'md-add'} size={35} color={'orange'} />
        </TouchableOpacity>
      </View>
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
  },
  newNoteButton: {
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowRadius: 3,
    elevation: 7,
  },
  lightThemeNewNoteButton: {
    backgroundColor: 'white',
  },
  darkThemeNewNoteButton: {
    backgroundColor: '#303030',
  },
  newNoteButtonContainer: {
    bottom: '3%',
    right: '7%',
    alignSelf: 'center',
    height: '10%',
    position: 'absolute',
  }
});
