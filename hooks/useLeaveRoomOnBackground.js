import { useEffect } from 'react';
import { AppState } from 'react-native';

const useLeaveRoomOnBackground = (socket, room) => {
  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === 'background') {
        console.log('App has gone to the background!');
        socket.emit('leave_room', { room });
      }
    };

    AppState.addEventListener('change', handleAppStateChange);

    return () => {
      AppState.removeEventListener('change', handleAppStateChange);
    };
  }, [socket, room]);
};

export default useLeaveRoomOnBackground;