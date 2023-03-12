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

export const socket: ExtendedSocket = io('http://localhost:3001', {transports: ['websocket']}); // IP on private network (localhost works too)

socket.name = '';
socket.room = null;
socket.role = null;
socket.isReady = false;
socket.isTurn = false;
socket.isProtected = false;

export const socketContext = createContext(socket);