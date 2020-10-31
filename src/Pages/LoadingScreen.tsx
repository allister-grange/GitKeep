import React, { useState } from 'react';
import { Text, SafeAreaView, StyleSheet, TextInput, View, ScrollView, ActivityIndicator } from 'react-native';
import { Appearance, useColorScheme } from 'react-native-appearance';

const LoadingScreen = () => {

    Appearance.getColorScheme();
    const colorScheme = useColorScheme();

    const themeContainerStyle =
        colorScheme === 'light' ? styles.lightContainer : styles.darkContainer;

    return (
        <SafeAreaView style={[styles.container, themeContainerStyle]}>
            <ActivityIndicator color={'coral'} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 30,
        justifyContent: 'center',
        alignItems: 'center'
    },
    lightContainer: {
        backgroundColor: 'white'
    },
    darkContainer: {
        backgroundColor: '#202020'
    },
});

export default LoadingScreen;
