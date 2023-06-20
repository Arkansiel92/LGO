"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Room_instances, _Room_generate_uuid, _Room_getPlayersToJSON;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Room = void 0;
class Room {
    constructor() {
        _Room_instances.add(this);
        this.id = __classPrivateFieldGet(this, _Room_instances, "m", _Room_generate_uuid).call(this);
        this.players = [];
        this.messages = [];
        this.night = false;
    }
    getRoom() {
        return {
            id: this.id,
            players: __classPrivateFieldGet(this, _Room_instances, "m", _Room_getPlayersToJSON).call(this),
            messages: this.messages,
            night: this.night
        };
    }
    getId() {
        return this.id;
    }
    setPlayer(player) {
        this.players.push(player);
        return this;
    }
    isCurrentRoom(uid) {
        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i].uid === uid) {
                return true;
            }
        }
        return false;
    }
}
exports.Room = Room;
_Room_instances = new WeakSet(), _Room_generate_uuid = function _Room_generate_uuid() {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < 6) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}, _Room_getPlayersToJSON = function _Room_getPlayersToJSON() {
    let players = [];
    this.players.forEach(player => {
        players.push({
            uid: player.uid,
            user: player.user,
            role: player.role,
            frames: player.frames,
            x: player.x,
            y: player.y,
            isDead: player.isDead
        });
    });
    return players;
};
