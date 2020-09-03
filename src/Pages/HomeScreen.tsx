import React, { useEffect, useState } from 'react';
import { Text, SafeAreaView, StatusBar, StyleSheet, ScrollView, View, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { Appearance, useColorScheme } from 'react-native-appearance';
import { Note } from '../Components/Notes/Note';
import * as SecureStore from 'expo-secure-store';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useIsFocused } from '@react-navigation/native';
import { parseRepoData, FileData, getRepoContentsFromTree } from '../Services/GitHub';
import Toast from 'react-native-root-toast';

const HomeScreen = () => {

  Appearance.getColorScheme();
  const colorScheme = useColorScheme();
  const navigation = useNavigation();
  const [files, setFiles] = useState(new Array<FileData>());
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const isFocused = useIsFocused();

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
  const themeActivityIndicator =
    colorScheme === 'light' ? 'black' : 'white';

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
  }, []);

  const getRepoData = async () => {
    let startTimeM = new Date().getTime()
    await getRepoContentsFromTree()
      .then(files => setFiles(files))
      .catch(err => alert(err));
    let durationM = new Date().getTime() - startTimeM
    console.log(durationM);
    //TIMINGS:
    //Asus
    //27159
    //27376
    //24345
    //Tech
    //21999
    //23317
  }

  const refreshNotes = async () => {
    setToastVisible(true);
    console.log("refreshing notes");
    await getRepoData();
    setToastVisible(false);
    console.log("done :)");
  }

  return (
    <SafeAreaView style={[styles.container, themeContainerStyle]}>
      <StatusBar barStyle={themeStatusBarStyle} />
      {
        loadingNotes ?
          <ActivityIndicator color={themeActivityIndicator} size={40} />
          :
          <ScrollView style={styles.notesContatiner} refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
            {
              files.map((file, idx) => (
                <Note refreshNotes={refreshNotes} key={idx} file={file} />
              ))
            }
          </ScrollView>

      }

      <View style={styles.newNoteButtonContainer}>
        <TouchableOpacity style={[styles.newNoteButton, themeNewNoteButtonStyle]}
          onPress={() => navigation.navigate('CreateNoteScreen')}>
          <Ionicons outline={false} name={'md-add'} size={35} color={'orange'} />
        </TouchableOpacity>
      </View>
      <Toast
        visible={toastVisible}
        position={Toast.positions.BOTTOM - 30}
        shadow={false}
        animation={false}
        hideOnPress={true}
      >Saving changes to git :)</Toast>
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
