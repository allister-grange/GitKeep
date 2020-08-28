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
    4) Convert to this <https://www.npmjs.com/package/@octokit/core>
    5) One tap on a note expands it out, hold on it to edit it 
    6) On a note there will be a delete icon in the upper right
    7) Pull up to refresh
