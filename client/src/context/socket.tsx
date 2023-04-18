import {createContext} from 'react';
import {io, Socket} from 'socket.io-client';

export interface ExtendedSocket extends Socket {
    name?: string,
    room?: string | null,
}

export const socket: ExtendedSocket = io('wss://' + location.host +'/', {transports: ['websocket']});
//export const socket: ExtendedSocket = io('http://localhost:3001', {transports: ['websocket']});

socket.name = '';
socket.room = null;

export const socketContext = createContext(socket);