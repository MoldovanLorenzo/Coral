import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import * as SQLite from 'expo-sqlite';
import AsyncStorage from '@react-native-async-storage/async-storage';
const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  useEffect(() => {
    
    const db = SQLite.openDatabase("CoralCache.db");
    console.log('Entered use effect')
    const newSocket = io("https://chatroom-backend-t2ok.onrender.com", {
    });
    newSocket.on('backend_message',(response)=>{
       console.log('recieved backend message, og')
       console.log(response)
    })
    newSocket.on('connect',()=>{
      console.log('socket_connected')
    })
    
    
    setSocket(newSocket);
     
    return () => newSocket.close();
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

