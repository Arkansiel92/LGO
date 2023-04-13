import {createContext} from 'react';
import {io, Socket} from 'socket.io-client';

export interface ExtendedSocket extends Socket {
    name?: string,
    room?: string | null,
    role?: string | null,
    isReady?: boolean,
    isTurn?: boolean,
    isProtected?: boolean,
}

export const socket: ExtendedSocket = io('http://153.92.223.27:3001', {transports: ['websocket']}); // IP on private network (localhost works too)

socket.name = '';
socket.room = null;

export const socketContext = createContext(socket);