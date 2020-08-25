/**
 * 
 * Can be further abstracted to have multiple service providers by having a 'git' service that proxies the requests 
 * and forwards them to the correct service by using a stored value that holds what repo they're using by what service 
 * was chosen on authentication 
 *  
 * */
import * as SecureStore from 'expo-secure-store';
import { Buffer } from 'buffer';

export const getAuthenticatedUserName = async () => {
    const url = 'https://api.github.com/user';
    const token = await SecureStore.getItemAsync('github_token');

    const headers = new Headers({
        'Authorization': 'Token ' + token,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        "X-Requested-With": "XMLHttpRequest"
    });

    await fetch('https://cors-anywhere.herokuapp.com/' + url, { method: 'GET', headers: headers })
        .then(res => res.json())
        .then(async (data) => {
            await SecureStore.setItemAsync('user_name', data.login);
        })
        .catch(err => console.log(err))
}

export const getAccessToken = async (code: string) => {
    const url = 'https://github.com/login/oauth/access_token';

    //figure out this header, bit dodgy 
    const headers = new Headers({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        "X-Requested-With": "XMLHttpRequest"
    });

    await fetch('https://cors-anywhere.herokuapp.com/' + url + '?client_id=0ebefb6bb5e94c6193a0&client_secret=1905a7cc5a255be077df3fc6a848ba2de15e2913&code=' + code, { method: 'POST', headers: headers })
        .then(res => res.json())
        .then(async (data) => {
            await SecureStore.setItemAsync('github_token', data.access_token);
        })
        .catch(err => console.log(err))
}

export const fetchUserRepos = async (): Promise<any> => {
    const token = await SecureStore.getItemAsync('github_token');

    const url = 'https://api.github.com/user/repos'

    const headers = new Headers({
        'Authorization': 'Token ' + token
    })

    let userRepos = {}

    await fetch(url, { method: 'GET', headers: headers })
        .then(res => res.json())
        .then(data => userRepos = data)
        .catch(err => console.log(err))

    return userRepos;
}

export const fetchRepoContents = async (): Promise<any> => {

    console.log("fetching repo contents ");

    const repoName = await SecureStore.getItemAsync('repo_name');
    const githubToken = await SecureStore.getItemAsync('github_token');
    const userName = await SecureStore.getItemAsync('user_name');

    const url = 'https://api.github.com/repos/' + userName + '/' + repoName + '/contents/';

    const headers = new Headers({
        'Authorization': 'Token ' + githubToken,
        'Accept': 'application/vnd.github.VERSION.raw',
        "X-Requested-With": "XMLHttpRequest"
    });

    let repoData = {};

    await fetch('https://cors-anywhere.herokuapp.com/' + url, { method: 'GET', headers: headers })
        .then(res => res.json())
        .then(async (data) => {
            repoData = data;
        })
        .catch(err => console.log(err))

    return repoData;
}

export const getFileContentOfUrl = async (url: string): Promise<string> => {
    const token = await SecureStore.getItemAsync('github_token');

    const headers = new Headers({
        'Authorization': 'Token ' + token,
        'Accept': 'application/vnd.github.v3+json',
        "X-Requested-With": "XMLHttpRequest"
    });

    let fileContent = ""

    await fetch(url, { method: 'GET', headers: headers })
        .then(res => res.json())
        .then(data => fileContent = Buffer.from(data.content, 'base64').toString('ascii'))
        .catch(err => console.log(err))

    return fileContent;
}