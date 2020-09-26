import React from 'react';
import { Animated, StyleSheet, TextInput, ActivityIndicator } from 'react-native';
import { Dimensions } from 'react-native';

const SearchComponent = (props: any) => {
    const { clampedScroll } = props;

    const searchBarTranslate = clampedScroll.interpolate({
        inputRange: [0, 50],
        outputRange: [0, -(250)],
        extrapolate: 'clamp',
    });

    const searchBarOpacity = clampedScroll.interpolate({
        inputRange: [0, 10],
        outputRange: [0.9, 0],
        extrapolate: 'clamp',
    });

    return (
        <Animated.View style={[
            styles.container,
            {
                transform: [
                    {
                        translateY: searchBarTranslate
                    }
                ],
                opacity: searchBarOpacity,
                flexDirection: 'row',
                flex: 1,
            },
        ]}>
            <TextInput
                placeholder='Search'
                style={styles.formField}
                placeholderTextColor={'#888888'}
                onChange={(event) => props.changeSearchTerm(event.nativeEvent.text)}
            />
            {                
                props.isSearching && <ActivityIndicator color={'coral'}/>
            }
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 50,
        width: Dimensions.get('window').width - 40,
        left: 20,
        zIndex: 1,
        backgroundColor: 'white',
        borderWidth: 1,
        padding: 12,
        paddingLeft: 20,
        paddingRight: 20,
        borderRadius: 20,
        borderColor: '#888888',
        fontSize: 18,
        height: 50,

    },
    formField: {
        flex: 1,
    }
})

export default SearchComponent;