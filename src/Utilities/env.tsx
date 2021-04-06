import Constants from 'expo-constants';

const ENV = {
    dev: {
        GITHUB_CLIENT: 'f650074141df1680eea5',
        GITHUB_SECRET: '32dd042a36a22206b1cba0818e653b4d46e8cb58'      // Add other keys you want here
    },
    staging: {
        GITHUB_CLIENT: 'f650074141df1680eea5',
        GITHUB_SECRET: '32dd042a36a22206b1cba0818e653b4d46e8cb58'      // Add other keys you want here
    },
    prod: {
        GITHUB_CLIENT: '0ebefb6bb5e94c6193a0',
        GITHUB_SECRET: '55d17f9ed34220be4f98c07b4891e6727dee2df0'
    }
};

const getEnvVars = (env = Constants.manifest.releaseChannel) => {
    if (env === null || env === undefined || env === "" || env.indexOf("dev") !== -1) return ENV.dev;
    if (env.indexOf("staging") !== -1) return ENV.staging;
    if (env.indexOf("prod") !== -1) return ENV.prod;
    if (env.indexOf("default") !== -1) return ENV.prod;
}

const selectedENV = getEnvVars();

export default selectedENV;