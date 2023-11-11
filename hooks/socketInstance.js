import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import * as SQLite from 'expo-sqlite';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useLeaveRoomOnBackground from './useLeaveRoomOnBackground';
const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};
function generateUUID() {
  let d = new Date().getTime();
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
  return uuid;
}
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
    newSocket.on('connect',async ()=>{
      console.log('FETCHING MESSAGESS....')
      const user_id=await AsyncStorage.getItem("user_id")
      newSocket.emit('fetch_pending_messages',{'sender_id':user_id})
    })
    useLeaveRoomOnBackground(socket, room);
    newSocket.on('pending_messages', async (data) => {
      console.log('received pending messages');
      try {
        await db.transaction((tx) => {
          data.forEach(async(message) => {
            await new Promise((resolve, reject) => {
              tx.executeSql(
                "INSERT INTO message (id, content, local_sender, chatroom_id, timestamp) VALUES (?, ?, ?, ?, ?);",
                [generateUUID(), message.message, false, message.room, message.timestamp],
                () => {
                  console.log("Message saved");
                  console.log(message)
                  resolve();
                },
                (t, error) => {
                  console.error("Error saving message", error);
                  reject(error);
                }
              );
            });
          });
        });
      } catch (error) {
        console.error("Database transaction error:", error);
      }
    }); 
    newSocket.emit('join_room',{"room":"main_room"})
    setSocket(newSocket);
     
    return () => newSocket.close();
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

