import Constants from 'expo-constants';

const ENV = {
    dev: {
        GITHUB_CLIENT: '',
        GITHUB_SECRET: ''      
    },
    staging: {
        GITHUB_CLIENT: '',
        GITHUB_SECRET: ''     
    },
    prod: {
        GITHUB_CLIENT: '',
        GITHUB_SECRET: ''
    }
};

const getEnvVars = (env = Constants.manifest.releaseChannel) => {
    if (env === null || env === undefined || env === "" || env.indexOf("dev") !== -1) return ENV.dev;
    if (env.indexOf("staging") !== -1) return ENV.staging;
    if (env.indexOf("prod") !== -1) return ENV.prod;
}

const selectedENV = getEnvVars();

export default selectedENV;