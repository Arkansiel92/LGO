"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
class Player {
    constructor(socket, room, user) {
        this.socket = socket;
        this.room = room;
        this.user = user;
        this.role = null;
    }
}
exports.Player = Player;
