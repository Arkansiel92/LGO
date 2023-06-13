"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Player_move;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
const uuid_1 = require("uuid");
class Player {
    constructor(socket) {
        _Player_move.set(this, 10);
        this.uid = (0, uuid_1.v4)();
        this.socket = socket;
        this.room = null;
        this.user = null;
        this.role = null;
        this.frames = { x: 0, y: 0 };
        this.x = 0;
        this.y = 0;
        this.isDead = false;
    }
    setRoom(uid) {
        this.room = uid;
        return this;
    }
    setUser(user) {
        this.user = user;
        return this;
    }
    setInputs(inputs) {
        if (inputs.up) {
            this.frames.y = 5;
            this.y = this.y - __classPrivateFieldGet(this, _Player_move, "f");
        }
        else if (inputs.down) {
            this.frames.y = 4;
            this.y = this.y + __classPrivateFieldGet(this, _Player_move, "f");
        }
        if (inputs.right) {
            this.frames.y = 6;
            this.x = this.x + __classPrivateFieldGet(this, _Player_move, "f");
        }
        else if (inputs.left) {
            this.frames.y = 7;
            this.x = this.x - __classPrivateFieldGet(this, _Player_move, "f");
        }
        if (this.frames.x < 5) {
            this.frames.x++;
        }
        else {
            this.frames.x = 0;
        }
        if (!inputs.up && !inputs.down && !inputs.left && !inputs.right) {
            this.frames.x = 0;
            this.frames.y = 0;
        }
        return this;
    }
    getSocket() {
        return this.socket.id;
    }
    getRoom() {
        return this.room;
    }
}
exports.Player = Player;
_Player_move = new WeakMap();
