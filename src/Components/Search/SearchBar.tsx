import React from 'react';
import { Animated, Platform, StyleSheet, TextInput, ActivityIndicator, View, Text, Alert } from 'react-native';
import { Dimensions } from 'react-native';
import { MenuProvider, Menu, MenuTrigger, MenuOptions, MenuOption } from 'react-native-popup-menu';
import { AntDesign } from '@expo/vector-icons';
import { Appearance, useColorScheme } from 'react-native-appearance';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { StackNavigationProp } from '@react-navigation/stack';

const SearchBar = (props: any) => {
    const { clampedScroll } = props;
    Appearance.getColorScheme();
    const colorScheme = useColorScheme();
    const navigation = useNavigation();

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

    const menuContainerStyle =
        colorScheme === 'light' ? styles.lightContainer : styles.darkMenuContainer;
    const themeTextStyle =
        colorScheme === 'light' ? styles.lightText : styles.darkText;

    const SignoutAlert = () =>
        Alert.alert(
            "Sign out",
            "Are you sure you want to sign out?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel pressed"),
                    style: "cancel"
                },
                {
                    text: "Yes", onPress: () => {
                        props.setLoggedOut();
                        // navigation.navigate('AuthScreen');
                    }
                }
            ],
            { cancelable: false }
        );

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
            <View style={{ flex: 1 }}>
                <TextInput
                    placeholder='Search'
                    style={styles.formField}
                    placeholderTextColor={'#888888'}
                    onChange={(event) => props.changeSearchTerm(event.nativeEvent.text)}
                />
            </View>
            {
                props.numOfColumns === 1 ?
                    <TouchableOpacity onPress={() => props.changeGridView(2)}>
                        <Feather name="grid" size={24} color="black" />
                    </TouchableOpacity>
                    :
                    <TouchableOpacity onPress={() => props.changeGridView(1)}>
                        <Feather name="square" size={24} color="black" />
                    </TouchableOpacity>
            }

            {/* {                
                        props.isSearching && <ActivityIndicator color={'coral'}/>
                    } */}
            <Menu>
                <MenuTrigger>
                    <AntDesign style={styles.ellipses} name="ellipsis1" size={24} color={'black'} />
                </MenuTrigger>
                <MenuOptions customStyles={{ optionsContainer: menuContainerStyle }}>
                    <MenuOption onSelect={props.toggleContentView}>
                        <Text style={[styles.menuText, themeTextStyle]}>Toggle Content View</Text>
                    </MenuOption>
                    <MenuOption onSelect={() => navigation.navigate('RepoSelectScreen')}>
                        <Text style={[styles.menuText, themeTextStyle]}>Change Repo</Text>
                    </MenuOption>
                    <MenuOption onSelect={() => SignoutAlert()}>
                        <Text style={[styles.menuText, themeTextStyle]}>Sign Out</Text>
                    </MenuOption>
                </MenuOptions>
            </Menu>

        </Animated.View>
    )
}

export default SearchBar

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: Platform.OS === 'android' ? 25 : 50,
        width: Dimensions.get('window').width - 40,
        // left: -200,
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
        color: 'black'
    },
    menuText: {
        fontSize: 18
    },
    ellipses: {
        transform: [{ rotate: '90deg' }],
    },
    lightContainer: {
        backgroundColor: 'white'
    },
    darkContainer: {
        backgroundColor: '#202020'
    },
    darkMenuContainer: {
        backgroundColor: '#353535'
    },
    lightText: {
        color: 'black'
    },
    darkText: {
        color: 'white'
    },
})