import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from '../../AuthContext';
import  {API_URL} from '../config'

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { auth } = useAuth();

  useEffect(() => {
    if (auth?.user) {
      //api rest backend
      const newSocket = io(API_URL+'/', {
        transports: ['websocket', 'polling'],
        withCredentials: true
      });

      newSocket.on('connect', () => {
        console.log('Conectado al servidor Socket.IO');
        
        newSocket.emit('joinRoom', {
          tipo_usuario: auth.user.tipo_usuario,
          id_usuario: auth.user.id_usuario
        });
      });

      newSocket.on('connect_error', (error) => {
        console.error('Error de conexión Socket.IO:', error);
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, [auth]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);