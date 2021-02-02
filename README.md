# Yaketyyak-app

Yaketyyak-app is a chat application created using React Native. It is developed and tested using [Expo](https://expo.io/) and [Android Emulator](https://developer.android.com/studio). It utlizes [Google Firebase](https://firebase.google.com/) for data storage.

## Installation

Expo Steps:
1 - Install or update [Node](https://nodejs.org/en/)
2 - Install Expo CLI: $ npm install expo-cli --global
3 - Create an Expo account using their [sign-up page](https://expo.io/signup)
4 - Create your project: $ expo init yaketyyak-app
5 - Download the [Expo App](https://play.google.com/store/apps/details?id=host.exp.exponent&hl=en&gl=US) to use and test the app on your smart phone

You will also need Android Emulator to test your app.
Android Studio steps:
1 - Download [Android Studio](https://developer.android.com/studio)
2 - Once installed, use SDK Manager to set up your emulator

[Google Firebase](https://firebase.google.com/) is used for your chat app data storage.
Goodle Firebase steps:
1 - Install Firebase: $ npm install --save firebase@7.9.0
2 - Configure your database to store messages using the following format [Gifted Chat Message Object](https://github.com/FaridSafi/react-native-gifted-chat#message-object)
3 - Install async storage for offline yaketyyak-app use: expo install @react-native-community/async-storage
4 - Configure [Google Firebase Cloud Storage](https://firebase.google.com/products/storage/) to store chat images

# Final Steps

1 - Run your Expo project with: $ npm start or $ expo start
2 - Get to Yakking!

[Kanban Board](https://trello.com/b/8Xn7HWAC/chat-app-kanban)
