import React, { Component } from "react";
import { Text, View, Platform, KeyboardAvoidingView  } from "react-native";
import { GiftedChat, InputToolbar } from 'react-native-gifted-chat';
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from '@react-native-community/netinfo';

//Import Firestone
const firebase = require('firebase');
require('firebase/firestore');

export default class Chat extends Component {
  constructor(props) {
    super(props);
    //Create state object for messages
    this.state = {
      messages: [],
      uid: 0,
      isConnected: false,
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
    this.referenceChatAppUser = null;
    //Create reference to Firestore messages
    this.referenceMessages = firebase.firestore().collection("messages");
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
        user: data.user,
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
      uid: this.state.uid,
    });
  };

  //Function called when user sends a message
  onSend(messages = []) {
    this.setState(
      (previousState) => ({
        messages: GiftedChat.append(previousState.messages, messages),
      }),
      () => {
        this.addMessage();
        this.saveMessages();
      }
    );
  }
  
  async getMessages() {
    let messages = "";
    // wrap logic in try and catch so that errors can be caught
    try {
      // await used to wait until asyncStorage promise settles
      // Read messages in storage with getItem method (takes a key)
      messages = (await AsyncStorage.getItem("messages")) || [];
      // Give messages variable the saved data via setState
      this.setState({
        // Use JSON.parse to convert saved string back into an object
        messages: JSON.parse(messages),
      });
    } catch (error) {
      console.log(error.message);
    }
  }
  async saveMessages() {
    try {
      await AsyncStorage.setItem(
        "messages",
        JSON.stringify(this.state.messages)
      );
    } catch (error) {
      console.log(error.message);
    }
  }
  async deleteMessages() {
    try {
      await AsyncStorage.removeItem("messages");
    } catch (error) {
      console.log(error.message);
    }
  }

  renderInputToolbar(props) {
    console.log("Message from renderInputToolbar: " + this.state.isConnected);
    if (!this.state.isConnected === false) {
      return <InputToolbar {...props} />;
    }
  }

  componentDidMount() {
    // displays user's name in navigation bar
    let { name } = this.props.route.params;
    this.props.navigation.setOptions({ title: name });
    NetInfo.fetch().then((state) => {
      
    });

    // Subscribe to updates about the network state
    NetInfo.addEventListener((state) => {
      const isConnected = state.isConnected;
      if (isConnected == true) {
        this.setState({
          isConnected: true,
        });
      } else {
        this.setState({
          isConnected: false,
        });
      }
    });

    NetInfo.fetch().then((state) => {
      const isConnected = state.isConnected;
      if (isConnected == true) {
        this.setState({
          isConnected: true,
        });
        // Listen to authentication events
        // onAuthStateChanged() function called when user's sign-in state changes, returns unsubscribe() function, provides user object
        this.authUnsubscribe = firebase
          .auth()
          .onAuthStateChanged(async (user) => {
            if (!user) {
              await firebase.auth().signInAnonymously();
            }

            // update user state with current user data
            this.setState({
              uid: user.uid,
              messages: [],
            });

            // Create a reference to active user's messages
            this.referenceChatAppUser = firebase
              .firestore()
              .collection("messages")
              .orderBy("createdAt", "desc");

            // Listens for collection changes
            this.unsubscribeChatAppUser = this.referenceChatAppUser.onSnapshot(
              this.onCollectionUpdate
            );
          });
      } else {
        this.setState({
          isConnected: false,
        });
        this.getMessages();
      }
    });
  }

  componentWillUnmount() {
    // Stop listening to authentication and changes
    this.authUnsubscribe();
    this.unsubscribeChatAppUser();
  }
  
  render() {
    return (
      <View style={{flex: 1, backgroundColor: this.props.route.params.color}}>
        <Text style={{textAlign: 'center', marginTop: 10}}>{this.state.loggedInText}</Text>
        <GiftedChat
        messages={this.state.messages}
        onSend={messages => this.onSend(messages)}
        renderInputToolbar={this.renderInputToolbar.bind(this)}
        user={{
          _id: this.state.uid,
          avatar: "https://placeimg.com/140/140/any",
          name: this.props.route.params.name,
        }}
        renderUsernameOnMessage={true}
        />
        { Platform.OS === 'android' ?
         <KeyboardAvoidingView behavior="height" /> : null
        }
        </View>
    )
  }
}