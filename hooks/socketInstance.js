import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    console.log('Entered use effect')
    const newSocket = io("https://chatroom-backend-t2ok.onrender.com/", {
    });
    newSocket.on('backend_message',(response)=>{
       console.log('recieved backend message, og')
       console.log(response)
    })
    
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

