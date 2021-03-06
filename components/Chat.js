import React from 'react';
import { View, Text, KeyboardAvoidingView, Platform, Image, LogBox } from 'react-native';
import { GiftedChat, InputToolbar } from 'react-native-gifted-chat';
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from '@react-native-community/netinfo';
import MapView from 'react-native-maps';
import CustomActions from './CustomActions';

const firebase = require('firebase');
require('firebase/firestore');

export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      user: {
        _id: '',
        name: '',
        avatar: ''
      },
      loggedInText: '',
      isConnected: false,
      image: null,
      location: null
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
      this.referenceMessages = firebase.firestore().collection('messages');
  }
  
  componentDidMount() {
    let name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name });
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
          if (!user) {
            await firebase.auth().signInAnonymously();
          }
          //Update user state with currently active user data
          this.setState({
            isConnected: true,
            user: {
              _id: user.uid,
              name: this.props.route.params.name,
              avatar: 'https://placeimg.com/140/140/any'
            },
            loggedInText: `${this.props.route.params.name} has entered the chat. Welcome, start yakking!`,
            messages: []
          });
          this.unsubscribe = this.referenceMessages.onSnapshot(this.onCollectionUpdate)
        });
      } else {
        this.setState({
          isConnected: false
        });
        this.getMessages();
      }
    });
    LogBox.ignoreLogs(['Setting a timer']);
    this.referenceMessages = firebase.firestore().collection('messages');
  }
  
   componentWillUnmount() {
     this.unsubscribe();
     this.authUnsubscribe();
  }
  
  /**
   * @function onSend
   * @param {*} messages 
   * @return {state}
   */
  onSend( messages = [] ) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages,
        messages),
    }),
    () => {
      this.addMessage();
      this.saveMessages();
     }
    );
  }
  
  /**
   * Adds messages
   * @function addMessage
   * @param _id - message _id
   * @param {string}  text - message text
   * @param {date} date - message data
   * @param {string} image - message image
   * @param {number} location - message location
   */
  addMessage() {
    const message = this.state.messages[0];
    this.referenceMessages.add({
      _id: message._id,
      text: message.text || '',
      createdAt: message.createdAt,
      user: message.user,
      image: message.image || null,
      location: message.location || null
    });
    console.log(message);
  }
  
  /**
   * Loads messages from AsyncStorage
   * @function getMessages
   * @async
   * @param {string} messages
   * @return {state} messages
   */
  async getMessages() {
    let messages = '';
    try {
      messages = await AsyncStorage.getItem('messages') || [];
      this.setState({
        messages: JSON.parse(messages)
      });
    } catch (error) {
      console.log(error.message);
    }
  }
  
  /**
   * Saves messages to AsyncStorage
   * @function saveMessages
   * @async
   * @return {AsyncStorage}
   */
  async saveMessages() {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
    } catch (error) {
      console.log(error.message);
    }
  }
  
  /**
   * Deletes messages from AsyncStorage
   * @function deleteMessages
   * @async
   * @return {AsyncStorage}
   */
  async deleteMessages() {
    try {
      await AsyncStorage.removeItem('messsages');
      this.setState({
        messages: []
      });
  } catch (error) {
    console.log(error.message);
    }
  }
  
  /**
   * Updates message state
   * @function onCollectionUpdate
   * @param {*} querySnapshot 
   * @param {string}  _id - data _id
   * @param {string}  text - data text
   * @param {date}   date - data date
   * @param {string} image - data image
   * @param {number} location - data location
   */
  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    querySnapshot.forEach((doc) => {
      let data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: {
          _id: data.user._id,
          name: data.user.name,
          avatar: data.user.avatar
        },
        image: data.image || '',
        location: data.location || ''
      });
    });
    this.setState({
      messages,
    });
  }
  
  /**
   * If user online, renders input toolbar
   * @function renderInputToolbar
   * @param {*} props 
   * @returns {InputToolbar}
   */
  renderInputToolbar(props) {
    if (this.state.isConnected == false) {
    } else {
      return(
        <InputToolbar
        {...props}
        />
      );
    }
  }
  
  /**
   * Renders the mapview if location coordinates exist
   * @function renderCustomView
   * @param {*} props 
   * @returns {MapView}
   */
  renderCustomView(props) {
    const { currentMessage } = props;
  
    if(currentMessage.location){
      return (
        <View>
        <MapView
          style={{width: 150,
            height: 100,
            borderRadius: 13,
            margin: 3}}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
          }}
        />
        </View>
      );
    }
    return null;
  }
  
  /**
   * Renders the take pic, choose pic and share location
   * @function renderCustomActions
   * @param {*} props 
   * @return {CustomActions}
   */
  renderCustomActions = (props) => {
    return <CustomActions {...props} />;
  }
  
    render() {
      return (
        <View style={{flex: 1, backgroundColor: this.props.route.params.color}}>
          <Text style={{textAlign: 'center', marginTop: 10}}>{this.state.loggedInText}</Text>
          {this.state.image &&
            <Image source={{ uri: this.state.image.uri }}
             style={{ width: 200, height: 200 }} />}
          <GiftedChat
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={this.state.user}
          renderInputToolbar={this.renderInputToolbar.bind(this)}
          renderActions={this.renderCustomActions}
          renderCustomView={this.renderCustomView}
          image={this.state.image}
          />
          { Platform.OS === 'android' ?
           <KeyboardAvoidingView behavior="height" /> : null
          }
          </View>
      )
    }
  }