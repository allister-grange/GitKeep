import React, { FunctionComponent } from "react";
import { Text, TouchableOpacity, StyleSheet, Image } from "react-native";

type PassedProps = {
    disabled: boolean,
    onPress: () => void,
  };
  
export const GitHubLoginButton: FunctionComponent<PassedProps> = ({ disabled, onPress }) => {
    return(
      <TouchableOpacity
        style={ styles.githubStyle }
        onPress={onPress}
        disabled={disabled}
      >
        <Image
          source={require("../../../assets/github.png")}
          style={ styles.imageIconStyle }
        />
        <Text style={styles.textStyle}>
            "Sign in with GitHub"
        </Text>
      </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    githubStyle: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#333",
      borderWidth: 0.5,
      borderColor: "#fff",
      height: 40,
      width: 220,
      borderRadius: 5,
      margin: 5
    },
    imageIconStyle: {
      padding: 10,
      marginLeft: 15,
      height: 25,
      width: 25,
      resizeMode: "stretch"
    },
    textStyle: {
      color: "#fff",
      marginLeft: 20,
      marginRight: 20
    }
  });