import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";

export default class Chat extends Component {
  componentDidMount() {
    let name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name });
  }
  render() {
    return (
      <View
        style={[
          styles.chatContainer,
          { backgroundColor: this.props.route.params.color },
        ]}
      >
        <Text style={{ color: 'white' }}>Chat Screen</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  chatContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});