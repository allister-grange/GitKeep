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
import { getFileContentOfUrl } from '../Services/GitHub';

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

  const fetchRepoContents = async () => {
    const repoName = await SecureStore.getItemAsync('repo_name');
    const githubToken = await SecureStore.getItemAsync('github_token');
    const userName = await SecureStore.getItemAsync('user_name');

    const url = 'https://api.github.com/repos/' + userName + '/' + repoName + '/contents/';

    const headers = new Headers({
      'Authorization': 'Token ' + githubToken,
      'Accept': 'application/vnd.github.VERSION.raw',
      "X-Requested-With": "XMLHttpRequest"
    });

    await fetch('https://cors-anywhere.herokuapp.com/' + url, { method: 'GET', headers: headers })
      .then(res => res.json())
      .then(async (data) => {
        parseRepoData(data);
      })
      .catch(err => console.log(err))

  }

  const parseRepoData = async (data: any) => {
    let urlsOfFilesToDownload: Array<string> = new Array<string>();

    data.forEach((file: any) => {
      //add in check for markdown here 
      if (file.type !== 'dir') {
        console.log(file.name);
        urlsOfFilesToDownload.push(file.url);
      }
    });

    let contentOfFilesArray = new Array<string>();

    for (let url in urlsOfFilesToDownload) {
      getFileContentOfUrl(urlsOfFilesToDownload[url])
        .then(fileContent => (contentOfFilesArray.push(fileContent)))
    }

    setFiles(contentOfFilesArray);
  }

  React.useEffect(() => {

    async function pullDownFiles() {
      setLoadingNotes(true);
      await fetchRepoContents();
      console.log(files[0]);
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
            <Text>{files.length}</Text>
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

/**
 *
 * Array [
  Object {
    "_links": Object {
      "git": "https://api.github.com/repos/allister-grange/Notes/git/trees/e7099c403932165905e68ff0858081697d40967d",
      "html": "https://github.com/allister-grange/Notes/tree/master/AzureTraining",
      "self": "https://api.github.com/repos/allister-grange/Notes/contents/AzureTraining?ref=master",
    },
    "download_url": null,
    "git_url": "https://api.github.com/repos/allister-grange/Notes/git/trees/e7099c403932165905e68ff0858081697d40967d",
    "html_url": "https://github.com/allister-grange/Notes/tree/master/AzureTraining",
    "name": "AzureTraining",
    "path": "AzureTraining",
    "sha": "e7099c403932165905e68ff0858081697d40967d",
    "size": 0,
    "type": "dir",
    "url": "https://api.github.com/repos/allister-grange/Notes/contents/AzureTraining?ref=master",
  },
  Object {
    "_links": Object {
      "git": "https://api.github.com/repos/allister-grange/Notes/git/blobs/5c66b5b4e8aa7a8896dfff401bead84bf9c5a94a",
      "html": "https://github.com/allister-grange/Notes/blob/master/Books.md",
      "self": "https://api.github.com/repos/allister-grange/Notes/contents/Books.md?ref=master",
    },
    "download_url": "https://raw.githubusercontent.com/allister-grange/Notes/master/Books.md?token=AEMTRBS7MGPBID42OWGKVH27IQRFI",
    "git_url": "https://api.github.com/repos/allister-grange/Notes/git/blobs/5c66b5b4e8aa7a8896dfff401bead84bf9c5a94a",
    "html_url": "https://github.com/allister-grange/Notes/blob/master/Books.md",
    "name": "Books.md",
    "path": "Books.md",
    "sha": "5c66b5b4e8aa7a8896dfff401bead84bf9c5a94a",
    "size": 875,
    "type": "file",
    "url": "https://api.github.com/repos/allister-grange/Notes/contents/Books.md?ref=master",
  },
  Object {
    "_links": Object {
      "git": "https://api.github.com/repos/allister-grange/Notes/git/blobs/d76e52b723394fdca9e61abd5bfc93b358fb3d45",
      "html": "https://github.com/allister-grange/Notes/blob/master/CodingNotes.md",
      "self": "https://api.github.com/repos/allister-grange/Notes/contents/CodingNotes.md?ref=master",
    },
    "download_url": "https://raw.githubusercontent.com/allister-grange/Notes/master/CodingNotes.md?token=AEMTRBWVMNIU73RCM7PZX5C7IQRFI",
    "git_url": "https://api.github.com/repos/allister-grange/Notes/git/blobs/d76e52b723394fdca9e61abd5bfc93b358fb3d45",
    "html_url": "https://github.com/allister-grange/Notes/blob/master/CodingNotes.md",
    "name": "CodingNotes.md",
    "path": "CodingNotes.md",
    "sha": "d76e52b723394fdca9e61abd5bfc93b358fb3d45",
    "size": 2077,
    "type": "file",
    "url": "https://api.github.com/repos/allister-grange/Notes/contents/CodingNotes.md?ref=master",
  },
  Object {
    "_links": Object {
      "git": "https://api.github.com/repos/allister-grange/Notes/git/blobs/8a0d85088b42582a9a58bbd9ed75fa6961f5ca20",
      "html": "https://github.com/allister-grange/Notes/blob/master/HomeCoding.md",
      "self": "https://api.github.com/repos/allister-grange/Notes/contents/HomeCoding.md?ref=master",
    },
    "download_url": "https://raw.githubusercontent.com/allister-grange/Notes/master/HomeCoding.md?token=AEMTRBSXEIF6EXT2DB665H27IQRFI",
    "git_url": "https://api.github.com/repos/allister-grange/Notes/git/blobs/8a0d85088b42582a9a58bbd9ed75fa6961f5ca20",
    "html_url": "https://github.com/allister-grange/Notes/blob/master/HomeCoding.md",
    "name": "HomeCoding.md",
    "path": "HomeCoding.md",
    "sha": "8a0d85088b42582a9a58bbd9ed75fa6961f5ca20",
    "size": 3367,
    "type": "file",
    "url": "https://api.github.com/repos/allister-grange/Notes/contents/HomeCoding.md?ref=master",
  },
  Object {
    "_links": Object {
      "git": "https://api.github.com/repos/allister-grange/Notes/git/blobs/68747ea34e66e13cd85c5e41ac393dfddd556a71",
      "html": "https://github.com/allister-grange/Notes/blob/master/Work%20Dates.md",
      "self": "https://api.github.com/repos/allister-grange/Notes/contents/Work%20Dates.md?ref=master",
    },
    "download_url": "https://raw.githubusercontent.com/allister-grange/Notes/master/Work%20Dates.md?token=AEMTRBQAU4GTG26E7TE4WJ27IQRFI",
    "git_url": "https://api.github.com/repos/allister-grange/Notes/git/blobs/68747ea34e66e13cd85c5e41ac393dfddd556a71",
    "html_url": "https://github.com/allister-grange/Notes/blob/master/Work%20Dates.md",
    "name": "Work Dates.md",
    "path": "Work Dates.md",
    "sha": "68747ea34e66e13cd85c5e41ac393dfddd556a71",
    "size": 9981,
    "type": "file",
    "url": "https://api.github.com/repos/allister-grange/Notes/contents/Work%20Dates.md?ref=master",
  },
  Object {
    "_links": Object {
      "git": "https://api.github.com/repos/allister-grange/Notes/git/trees/06085ebd788874a2c041e8af996339a0c88580f6",
      "html": "https://github.com/allister-grange/Notes/tree/master/archived_work_dates",
      "self": "https://api.github.com/repos/allister-grange/Notes/contents/archived_work_dates?ref=master",
    },
    "download_url": null,
    "git_url": "https://api.github.com/repos/allister-grange/Notes/git/trees/06085ebd788874a2c041e8af996339a0c88580f6",
    "html_url": "https://github.com/allister-grange/Notes/tree/master/archived_work_dates",
    "name": "archived_work_dates",
    "path": "archived_work_dates",
    "sha": "06085ebd788874a2c041e8af996339a0c88580f6",
    "size": 0,
    "type": "dir",
    "url": "https://api.github.com/repos/allister-grange/Notes/contents/archived_work_dates?ref=master",
  },
  Object {
    "_links": Object {
      "git": "https://api.github.com/repos/allister-grange/Notes/git/trees/82ad6b78ed8636dfb6b1d895a6127fc791314270",
      "html": "https://github.com/allister-grange/Notes/tree/master/diary",
      "self": "https://api.github.com/repos/allister-grange/Notes/contents/diary?ref=master",
    },
    "download_url": null,
    "git_url": "https://api.github.com/repos/allister-grange/Notes/git/trees/82ad6b78ed8636dfb6b1d895a6127fc791314270",
    "html_url": "https://github.com/allister-grange/Notes/tree/master/diary",
    "name": "diary",
    "path": "diary",
    "sha": "82ad6b78ed8636dfb6b1d895a6127fc791314270",
    "size": 0,
    "type": "dir",
    "url": "https://api.github.com/repos/allister-grange/Notes/contents/diary?ref=master",
  },
  Object {
    "_links": Object {
      "git": "https://api.github.com/repos/allister-grange/Notes/git/trees/41455b27e6bbedab71c9ad51f888c127513f23dc",
      "html": "https://github.com/allister-grange/Notes/tree/master/leetcode",
      "self": "https://api.github.com/repos/allister-grange/Notes/contents/leetcode?ref=master",
    },
    "download_url": null,
    "git_url": "https://api.github.com/repos/allister-grange/Notes/git/trees/41455b27e6bbedab71c9ad51f888c127513f23dc",
    "html_url": "https://github.com/allister-grange/Notes/tree/master/leetcode",
    "name": "leetcode",
    "path": "leetcode",
    "sha": "41455b27e6bbedab71c9ad51f888c127513f23dc",
    "size": 0,
    "type": "dir",
    "url": "https://api.github.com/repos/allister-grange/Notes/contents/leetcode?ref=master",
  },
  Object {
    "_links": Object {
      "git": "https://api.github.com/repos/allister-grange/Notes/git/trees/6127febede0289b65dc1e9d822cf16d1fcfeec1f",
      "html": "https://github.com/allister-grange/Notes/tree/master/linux",
      "self": "https://api.github.com/repos/allister-grange/Notes/contents/linux?ref=master",
    },
    "download_url": null,
    "git_url": "https://api.github.com/repos/allister-grange/Notes/git/trees/6127febede0289b65dc1e9d822cf16d1fcfeec1f",
    "html_url": "https://github.com/allister-grange/Notes/tree/master/linux",
    "name": "linux",
    "path": "linux",
    "sha": "6127febede0289b65dc1e9d822cf16d1fcfeec1f",
    "size": 0,
    "type": "dir",
    "url": "https://api.github.com/repos/allister-grange/Notes/contents/linux?ref=master",
  },
  Object {
    "_links": Object {
      "git": "https://api.github.com/repos/allister-grange/Notes/git/trees/9a493d6b5e65f5001703bf26dfd6c00207afca35",
      "html": "https://github.com/allister-grange/Notes/tree/master/work",
      "self": "https://api.github.com/repos/allister-grange/Notes/contents/work?ref=master",
    },
    "download_url": null,
    "git_url": "https://api.github.com/repos/allister-grange/Notes/git/trees/9a493d6b5e65f5001703bf26dfd6c00207afca35",
    "html_url": "https://github.com/allister-grange/Notes/tree/master/work",
    "name": "work",
    "path": "work",
    "sha": "9a493d6b5e65f5001703bf26dfd6c00207afca35",
    "size": 0,
    "type": "dir",
    "url": "https://api.github.com/repos/allister-grange/Notes/contents/work?ref=master",
  },
]
 */