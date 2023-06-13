import { message, player } from "./interface";
import { Player } from "./player";

class Room {
    id: string
    players: Player[]
    messages: message[]
    night: boolean

    constructor() {
        this.id = this.#generate_uuid();
        this.players = [];
        this.messages = [];
        this.night = false;
    }

    #generate_uuid(): string {
        let result = '';

        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;

        let counter = 0;
        while (counter < 6) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
          counter += 1;
        }

        return result;
    }

    #getPlayersToJSON(): player[] {
        let players: player[] = [];

        this.players.forEach(player => {
            players.push({
                uid: player.uid,
                user: player.user,
                role: player.role,
                frames: player.frames,
                x: player.x,
                y: player.y,
                isDead: player.isDead
            })
        })

        return players;
    }

    getRoom() {
        return {
            id: this.id,
            players: this.#getPlayersToJSON(),
            messages: this.messages,
            night: this.night
        }
    }

    getId(): string {
        return this.id;
    }
    
    setPlayer(player: Player): this {
        this.players.push(player);

        return this;
    }

}

export { Room };