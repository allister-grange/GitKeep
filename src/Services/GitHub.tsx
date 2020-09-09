/**
 * 
 * Can be further abstracted to have multiple service providers by having a 'git' service that proxies the requests 
 * and forwards them to the correct service by using a stored value that holds what repo they're using by what service 
 * was chosen on authentication 
 *  
 * */
import * as SecureStore from 'expo-secure-store';
import { Buffer } from 'buffer';

export type FileData = {
    fileInfo: any,
    fileContent: string,
    isDirectory: boolean,
}

// const proxyUrl = 'https://0.0.0.0:8080/'
const proxyUrl = 'https://cors-anywhere.herokuapp.com/'

export const getAuthenticatedUserName = async (): Promise<string> => {
    const url = 'https://api.github.com/user';
    const token = await SecureStore.getItemAsync('github_token');

    const headers = new Headers({
        'Authorization': 'Token ' + token,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        "X-Requested-With": "XMLHttpRequest"
    });

    return await fetch(proxyUrl + url, { method: 'GET', headers: headers })
        .then(res => res.json())
        .then(data => data.login)
        .catch(err => alert(err))
}

export const getAccessToken = async (code: string): Promise<string> => {
    const url = 'https://github.com/login/oauth/access_token';

    const headers = new Headers({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        "X-Requested-With": "XMLHttpRequest"
    });

    return await fetch(proxyUrl + url + '?client_id=0ebefb6bb5e94c6193a0&client_secret=1905a7cc5a255be077df3fc6a848ba2de15e2913&code=' + code, { method: 'POST', headers: headers })
        .then(res => res.json())
        .then(data => data.access_token)
        .catch(err => alert(err))
}

export const fetchUserRepos = async (): Promise<any> => {
    const token = await SecureStore.getItemAsync('github_token');

    console.log("fetching user's repos");

    const url = 'https://api.github.com/user/repos'

    const headers = new Headers({
        'Authorization': 'Token ' + token
    })

    return await fetch(url, { method: 'GET', headers: headers })
        .then(res => res.json())
        .then(data => data)
        .catch(err => alert(err))
}

export const getRepoContents = async (): Promise<any> => {

    console.log("fetching repo contents ");

    const repoName = await SecureStore.getItemAsync('repo_name');
    const githubToken = await SecureStore.getItemAsync('github_token');
    const userName = await SecureStore.getItemAsync('user_name');

    console.log("Repo name = " + repoName + " github token = " + githubToken + " userName = " + userName);

    const url = 'https://api.github.com/repos/' + userName + '/' + repoName + '/contents/';

    const headers = new Headers({
        'Authorization': 'Token ' + githubToken,
        'Accept': 'application/vnd.github.VERSION.raw',
        "X-Requested-With": "XMLHttpRequest"
    });

    return fetch(proxyUrl + url, { method: 'GET', headers: headers })
        .then(res => res.json())
        .then(data => data)
        .catch(err => alert(err))

}


// Object {
//     "mode": "100644",
//     "path": "work/bs3/PowerShell/whiteboard of first session.jpg",
//     "sha": "f00857147f42dbc8ef782af93fddb2cd4e54c56c",
//     "size": 144157,
//     "type": "blob",
//     "url": "https://api.github.com/repos/allister-grange/Notes/git/blobs/f00857147f42dbc8ef782af93fddb2cd4e54c56c",
//   },
export const getRepoContentsFromTree = async (): Promise<Array<FileData>> => {

    console.log("getRepoContentsFromTree");
    const repoName = await SecureStore.getItemAsync('repo_name');
    const githubToken = await SecureStore.getItemAsync('github_token');
    const userName = await SecureStore.getItemAsync('user_name');

    const url = 'https://api.github.com/repos/' + userName + '/' + repoName + '/git/trees/';

    const headers = new Headers({
        'Authorization': 'Token ' + githubToken,
        'Accept': 'application/vnd.github.v3+json',
        "X-Requested-With": "XMLHttpRequest"
    });

    const sha = await getMasterBranchTreeSha();

    const data = await fetch(proxyUrl + url + sha + '?recursive=1', { method: 'GET', headers: headers })
        .then(res => res.json())
        .then((data) => data)
        .catch(err => alert(err))

    let files = parseFileData(data);
    const filesWithContent = await getFileContentFromSha(files)

    return filesWithContent;
}

const getFileContentFromSha = async (files: FileData[]): Promise<FileData[]> => {

    const repoName = await SecureStore.getItemAsync('repo_name');
    const githubToken = await SecureStore.getItemAsync('github_token');
    const userName = await SecureStore.getItemAsync('user_name');

    const headers = new Headers({
        'Authorization': 'Token ' + githubToken,
        'Accept': 'application/vnd.github.v3+json',
        "X-Requested-With": "XMLHttpRequest"
    });

    const shaUrl = 'https://api.github.com/repos/' + userName + '/' + repoName + '/git/blobs/';

    await Promise.all(files.map(f => fetch(proxyUrl + shaUrl + f.fileInfo.sha, { method: 'GET', headers: headers })))
        .then(result => Promise.all(result.map(res => res.json())))
        .then(res => {
            for (let i = 0; i < res.length; i++) {
                if (res[i].content === "") {
                    files[i].fileContent = "#Empty Note :("
                }
                else {
                    files[i].fileContent = Buffer.from(res[i].content, 'base64').toString('ascii') as string
                }
            }            
        })
        .catch(error => {
            console.log(error);
        });

    return files;
}

//parses the sha token and the path of the file
const parseFileData = (data: any): Array<FileData> => {
    if(!data.tree){
        throw Error("No data to parse")
    }

    let shas = new Array<FileData>();

    for (let i = 0; i < data.tree.length; i++) {
        let path = data.tree[i].path as string;
        if (path.split('.').pop() === 'md') {
            shas.push({ fileInfo: { path: path, sha: data.tree[i].sha }, isDirectory: false, fileContent: "" })
        }
    }

    return shas;
}

export const getMasterBranchTreeSha = async (): Promise<string> => {
    const repoName = await SecureStore.getItemAsync('repo_name');
    const githubToken = await SecureStore.getItemAsync('github_token');
    const userName = await SecureStore.getItemAsync('user_name');

    const shaUrl = 'https://api.github.com/repos/' + userName + '/' + repoName + '/branches/master'

    const headers = new Headers({
        'Authorization': 'Token ' + githubToken,
        'Accept': 'application/vnd.github.VERSION.raw',
        "X-Requested-With": "XMLHttpRequest"
    });

    return await fetch(proxyUrl + shaUrl, { method: 'GET', headers: headers })
        .then(res => res.json())
        .then(data => data.commit.sha)
        .catch(err => alert(err));
}

export const parseRepoData = async (data: any): Promise<Array<FileData>> => {
    let files: Array<FileData> = new Array<FileData>();

    if (!data)
        throw Error;

    data.forEach((file: any) => {
        if (file.type !== 'dir' && file.name.split('.').pop() === 'md') {
            files.push({ fileInfo: file, fileContent: "", isDirectory: false });
        }
    });

    for (let fileInfo in files) {
        await getFileContentOfUrl(files[fileInfo].fileInfo.url)
            .then(fileContent => (files[fileInfo].fileContent = fileContent));
    }

    return files;
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
        .catch(err => alert(err))

    return fileContent;
}

export const deleteFile = async (file: FileData, path: string): Promise<any> => {

    const repoName = await SecureStore.getItemAsync('repo_name');
    const githubToken = await SecureStore.getItemAsync('github_token');
    const userName = await SecureStore.getItemAsync('user_name');

    const url = 'https://api.github.com/repos/' + userName + '/' + repoName + '/contents/' + file.fileInfo.path;
    // const fileContent = Buffer.from(newContent).toString('base64');

    const headers = new Headers({
        'Authorization': 'Token ' + githubToken,
        'Accept': 'application/vnd.github.VERSION.raw',
        "X-Requested-With": "XMLHttpRequest",
    });

    const body = JSON.stringify({
        "message": 'Updated from GitKeep :)',
        "sha": file.fileInfo.sha
    })

    let repoData = {};

    await fetch(proxyUrl + url, { method: 'DELETE', headers: headers, body: body })
        .then(res => res.json())
        .then(async (data) => {
            repoData = data;
        })
        .catch(err => alert(err))

    return repoData;

}

export const updateFileContent = async (file: FileData, newContent: string): Promise<any> => {
    const repoName = await SecureStore.getItemAsync('repo_name');
    const githubToken = await SecureStore.getItemAsync('github_token');
    const userName = await SecureStore.getItemAsync('user_name');

    const url = 'https://api.github.com/repos/' + userName + '/' + repoName + '/contents/' + file.fileInfo.path;
    const fileContent = Buffer.from(newContent).toString('base64');

    const headers = new Headers({
        'Authorization': 'Token ' + githubToken,
        'Accept': 'application/vnd.github.VERSION.raw',
        "X-Requested-With": "XMLHttpRequest",
    });

    const body = JSON.stringify({
        "message": 'Updated from GitKeep :)',
        "content": fileContent,
        "sha": file.fileInfo.sha
    })

    let repoData = {};

    await fetch(proxyUrl + url, { method: 'PUT', headers: headers, body: body })
        .then(res => res.json())
        .then(async (data) => {
            repoData = data;
        })
        .catch(err => alert(err))

    return repoData;
}