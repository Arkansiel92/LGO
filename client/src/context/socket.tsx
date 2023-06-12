import {createContext} from 'react';
import {io} from 'socket.io-client';

//export const socket = io('https://moonrise-game.fr:3001/', {transports: ['websocket']});
export const socket = io('http://localhost:3001', {transports: ['websocket']});

export const socketContext = createContext(socket);