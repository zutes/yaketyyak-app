import React from "react";
import {Button, ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View,} from "react-native";

const image = require("../assets/backgroundImage.png");

export default class Start extends React.Component {
  constructor(props) {
    super(props);
    this.state = { name: "", color: "" };
  }
  render() {
    return (
      <ImageBackground source={image} style={styles.image}>
        <Text style={styles.appTitle}>Yaketyyak</Text>
        <View style={styles.container}>
          <TextInput
            style={styles.nameInput}
            onChangeText={(name) => this.setState({ name })}
            value={this.state.name}
            placeholder="Enter Your Name"
          />
          <Text style={styles.chooseColorText}>Choose Background Color:</Text>
          <View style={styles.chooseColor}>
            <TouchableOpacity
              style={[styles.color, { backgroundColor: "#B9C6AE" }]}
              onPress={() => {
                this.setState({ color: "#B9C6AE" });
              }}
            />
            <TouchableOpacity
              style={[styles.color, { backgroundColor: "#8A95A5" }]}
              onPress={() => {
                this.setState({ color: "#8A95A5" });
              }}
            />
            <TouchableOpacity
              style={[styles.color, { backgroundColor: "#474056" }]}
              onPress={() => {
                this.setState({ color: "#474056" });
              }}
            />
            <TouchableOpacity
              style={[styles.color, { backgroundColor: "#090C08" }]}
              onPress={() => {
                this.setState({ color: "#090C08" });
              }}
            />
          </View>
          <View style={styles.chatButton}>
            <Button color="#757083"
              title="Start Yakking"
              onPress={() =>
                this.props.navigation.navigate("Chat", {
                  name: this.state.name,
                  color: this.state.color,
                })
              }
            />
          </View>
        </View>
      </ImageBackground>
    );
  }
}
const styles = StyleSheet.create({
  chatButton: {
    width: "80%",
    height: "20%",
    justifyContent: "center",
    margin: 10,
    color: "#FFFFFF"
  },
  chooseColorText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#757083",
    marginBottom: 20,
    alignItems: "center",
  },
  color: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    margin: 10,
    marginTop: 5,
  },
  chooseColor: {
    flex: 4,
    flexDirection: "row",
    margin: 20,
    alignItems: "center",
    marginTop: 20,
  },
  container: {
    flex: 1,
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 20,
    backgroundColor: "#FFFFFF",
    height: "44%",
    width: "88%",
  },
  image: {
    flex: 1,
  },
  nameInput: {
    fontSize: 16,
    fontWeight: "300",
    color: "#757083",
    width: "80%",
    height: "20%",
    marginBottom: 20,
    marginTop: 20,
    paddingLeft: 30,
    borderColor: "#757083",
    borderWidth: 1.5,
    borderRadius: 2,
    opacity: .5,
  },
  appTitle: {
    flex: 1,
    fontSize: 45,
    fontWeight: "600",
    color: "#FFFFFF",
    alignSelf: "center",
    marginTop: 75,
  },
});
