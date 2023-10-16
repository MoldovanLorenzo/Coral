import React, { Component } from 'react';
import { View, Text, FlatList, TextInput,TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import io from 'socket.io-client';
class FriendChat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      newMessage: '',
    };
    this.socket = io('http://simondarius.pythonanywhere.com ');
  }
  componentDidMount() {
    this.socket.on('connect', () => {
      console.log('Connected to Socket.IO server');
      this.socket.emit('connection_token', JSON.stringify({ socket_message: 'your-token-here' }));
    });

    this.socket.on('connect_ACK', (message) => {
      console.log('ACK received:', message);
    });

    this.socket.on('message', (message) => {
      console.log('Message received:', message);
      this.setState((prevState) => ({
        messages: [...prevState.messages, JSON.parse(message)]
      }));
    });
  }

  componentWillUnmount() {
    this.socket.close();
  }
  addMessage = () => {
    const { newMessage } = this.state;
    if (newMessage.trim() !== '') {
      const messageData = {
        user_message: newMessage,
        user_chatroom: 'chatroom-id',  
      };
      this.socket.emit('message', JSON.stringify(messageData));

      this.setState((prevState) => ({
        messages: [...prevState.messages, { text: newMessage }],
        newMessage: ''
      }));
    }
  };

  render() {
    const { messages, newMessage } = this.state;
    const { route } = this.props;
    const { friend } = route.params;

    return (
        <View style={{ flex: 1 }}>
        <FlatList
          data={messages}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={{ padding: 10, backgroundColor: 'lightgray', marginVertical: 5 }}>
              <Text>{item.text}</Text>
            </View>
          )}
        />
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TextInput
            style={{ flex: 1, height: 50, borderColor: 'gray', borderWidth: 1, margin: 5, borderRadius:25,paddingLeft:15 }}
            onChangeText={(text) => this.setState({ newMessage: text })}
            value={newMessage}
            placeholder="Introduceți un mesaj..."
          />
          <TouchableOpacity
            style={{ backgroundColor: '#ff9a00', padding: 10, margin: 5, borderRadius: 25}}
            onPress={this.addMessage}
          >
            <FontAwesome name="paper-plane" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default FriendChat;
