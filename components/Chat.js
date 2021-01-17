import React, { Component } from "react";
import { StyleSheet, Text, View, Platform, KeyboardAvoidingView  } from "react-native";
import { GiftedChat, Bubble } from 'react-native-gifted-chat'

export default class Chat extends Component {
  constructor() {
    super();
    this.state = {
      messages: [],
    };
  }
  
componentDidMount() {
  //Access the user name from the Start screen
  let name = this.props.route.params.name;
  this.props.navigation.setOptions({ title: name });
  this.setState({
    messages: [
     {
      _id: 1,
      text: 'Welcome to Yaketyyak Chat, ' + this.props.route.params.name +'!',
      createdAt: new Date(),
      user: {
       _id: 2,
       name: 'React Native',
       avatar: 'https://placeimg.com/140/140/any',
      },
     },
    {
      _id: 2,
      text: 'Hi there!',
      createdAt: new Date(),
      system: true,
    },
  ],
        
 })
}
  
  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
  }

  renderBubble(props) {
  return (
    //Set the color of the text bubble
    <Bubble
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: '#c4c3d0'
        }
      }}
    />
  )
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
      <GiftedChat
      renderBubble={this.renderBubble.bind(this)}
      messages={this.state.messages}
      onSend={messages => this.onSend(messages)}
      user={{
      _id: 1,
   }
  }
/>

{/*This ensures that the Android keyboard displays correctly */}
{ Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  chatContainer: {
    flex: 1,
  },
});