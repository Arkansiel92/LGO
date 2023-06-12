import { Socket } from "socket.io"

interface role {

}

interface user {
    username: string
}

class Player {
    socket: Socket;
    room: string | null;
    user: user | null;
    role: role | null;

    constructor(socket: Socket, room: string | null, user: user | null) {
        this.socket = socket;
        this.room = room;
        this.user = user;
        this.role = null;
    }
}

export { Player }