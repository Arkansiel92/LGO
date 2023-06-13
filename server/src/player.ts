import { Socket } from "socket.io"
import { frames, inputs, role, user } from "./interface";
import { v4 } from "uuid";

class Player {
    uid: string;
    socket: Socket;
    room: string | null;
    user: user | null;
    role: role | null;
    frames: frames;
    x: number;
    y: number;
    isDead: boolean

    #move = 10;

    constructor(socket: Socket) {
        this.uid = v4();
        this.socket = socket;
        this.room = null;
        this.user = null;
        this.role = null;
        this.frames = {x: 0, y: 0};
        this.x = 0;
        this.y = 0;
        this.isDead = false;
    }

    setRoom(uid: string): this {
        this.room = uid;

        return this;
    }

    setUser(user: user): this {
        this.user = user;

        return this;
    }

    setInputs(inputs: inputs): this {
        if (inputs.up) {
            this.frames.y = 5;
            this.y = this.y - this.#move;
        } else if (inputs.down) {
            this.frames.y = 4;
            this.y = this.y + this.#move;
        }

        if (inputs.right) {
            this.frames.y = 6;
            this.x = this.x + this.#move;
        } else if (inputs.left) {
            this.frames.y = 7;
            this.x = this.x - this.#move;
        }

        if (this.frames.x < 5) {
            this.frames.x++;
        } else {
            this.frames.x = 0;
        }

        if (!inputs.up && !inputs.down && !inputs.left && !inputs.right) {
            this.frames.x = 0;
            this.frames.y = 0;
        }

        return this;
    }

    getSocket(): string {
        return this.socket.id;
    }

    getRoom(): string | null {
        return this.room;
    }
}

export { Player };