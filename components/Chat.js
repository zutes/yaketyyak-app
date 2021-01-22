import React, { Component } from "react";
import { Text, View, Platform, KeyboardAvoidingView  } from "react-native";
import { GiftedChat } from 'react-native-gifted-chat';

//Import Firestone
const firebase = require('firebase');
require('firebase/firestore');

export default class Chat extends Component {
  constructor() {
    super();
    //Create state object for messages
    this.state = {
      messages: [],
      user: {
        _id: "",
        name: "",
        avatar: "",
      },
      loggedInText: "",
    };

    if (!firebase.apps.length){
      firebase.initializeApp({
        apiKey: "AIzaSyBc95YPsfb-u6KbhkYp9hwbTHtbJyD_L8M",
        authDomain: "yaketyyak-5952e.firebaseapp.com",
        projectId: "yaketyyak-5952e",
        storageBucket: "yaketyyak-5952e.appspot.com",
        messagingSenderId: "717042953721",
        appId: "1:717042953721:web:95bb88712d5d35d58ea128",
        measurementId: "G-12D1ZQKTTN"
      });
    }
    //Create reference to Firestore messages
    this.referenceMessages = firebase.firestore().collection("messages");
  }

  componentDidMount() {
    let name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name });
    this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      if (!user) {
        await firebase.auth().signInAnonymously();
      }
      //Update user state with currently active user data
      this.setState({
        user: {
          _id: user.uid,
          name: this.props.route.params.name,
          avatar: 'https://placeimg.com/140/140/any'
        },
        loggedInText: `${this.props.route.params.name} has entered the chat`,
        messages: []
      });
    });
    this.unsubscribe = this.referenceMessages.orderBy("createdAt", "desc").onSnapshot(this.onCollectionUpdate)
  }
  
   componentWillUnmount() {
     this.unsubscribe();
     this.authUnsubscribe();
  }

  //Function called when user sends a message
  onSend(messages = []) {
    this.setState(
      (previousState) => ({
        messages: GiftedChat.append(previousState.messages, messages),
      }),
      () => {
        this.addMessage();
      }
    );
  }

  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    //Loop through documents
    querySnapshot.forEach((doc) => {
      //Get data snapshot
      let data = doc.data();

      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: {
          _id: data.user._id,
          name: data.user.name,
          avatar: data.user.avatar,
        },
      });
    });
    this.setState({
      messages,
    });
  };

  addMessage() { 
    //Adds new messages to the collection
    const message = this.state.messages[0];
    this.referenceMessages.add({
      _id: message._id,
      text: message.text,
      createdAt: message.createdAt,
      user: message.user,
      
    });
  };
  
  render() {
    return (
      <View style={{flex: 1, backgroundColor: this.props.route.params.color}}>
        <Text style={{textAlign: 'center', marginTop: 10}}>{this.state.loggedInText}</Text>
        <GiftedChat
        messages={this.state.messages}
        onSend={messages => this.onSend(messages)}
        user={this.state.user}
        />
        { Platform.OS === 'android' ?
         <KeyboardAvoidingView behavior="height" /> : null
        }
        </View>
    )
  }
}