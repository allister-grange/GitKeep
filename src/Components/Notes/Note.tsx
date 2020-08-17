import React, { FunctionComponent } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Appearance, useColorScheme } from 'react-native-appearance'


export const Note: FunctionComponent = () => {


    return (

        <View style={styles.container}>
            <Text style={[styles.text, styles.title]}>Title</Text>
            <Text style={[styles.text, styles.paragraph]}>Loren Ipsum</Text>
        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#d3d3d3', 
        padding: 15,
        marginRight: 7,
        marginLeft: 7,
        marginTop: 4,
        marginBottom: 4,
    },
    title: {
        fontWeight: "600",
        fontSize: 17,
    },
    text: {
        color: 'black',
        alignSelf: 'flex-start',
    },
    paragraph: {
        color: 'grey',
        paddingTop: 10
    }

});
