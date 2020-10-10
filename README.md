# GitKeep


## Scaling Across Devices

https://medium.com/soluto-engineering/size-matters-5aeeb462900a

https://medium.com/@my.maithi/react-native-navigation-add-custom-button-in-the-middle-of-tabbar-6c390201a2bb 

For editor:
https://github.com/jerolimov/react-native-showdown


https://blog.expo.io/firebase-github-authentication-with-react-native-2543e32697b4

https://docs.expo.io/guides/authentication/#github

https://www.npmjs.com/package/react-native-root-toast


## How to manage repos

    1. Have the application store the repo on the file system, then git clone/push that folder
    
    
    2. Store every .md file in state?? Then when a user enters/exits a note, or every 5 minutes or something, do a push 
        1. Pull down the files into state, could 

### How to git clone repos with react native expo

Use the endpoint below:
https://docs.github.com/en/rest/reference/repos#get-repository-content


If file ends in .md, add it to a list to download the content from


Add in that downloaded content into cards 


Once a file is updated, update using this endpoint:
https://docs.github.com/en/rest/reference/repos#create-or-update-file-contents


### Create a new repo

https://developer.github.com/v3/repos/#create-a-repository-for-the-authenticated-user


### Next steps 

    - [X] Clean up the authentication flow
    - [X] Get the screens nicely passing props to eachother 
    - [X] Start on the integration with GitHub
    - [] Convert to this <https://www.npmjs.com/package/@octokit/core>
    - [X] One tap on a note expands it out, hold on it to edit it 
    - [] On a note there will be a three circle icon in the upper right, which will have delete, rename and move directory 
    - [X] Pull up to refresh
    - [] Some sort of alert that the app is refreshing when you edit a document (maybe an acitivity indicator then a tick once loaded)
    - [] Get the new note screen working, with an option of what directory to put the new note in 
    - [X] https://github.com/arnnis/react-native-fast-toast
    - [] Set height of note to zero (or hide it), until webview is ready
    - [X] Menu on a three ellepsis menu on the search bar (option to re-choose your repo)
    - [] Last edited dates on notes


### To Deploy to phone 

expo build:android -t apk 
adb install filename.apk