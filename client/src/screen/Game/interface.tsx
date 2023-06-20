interface title {
    title: string,
    color: string
}

export interface role {

}

interface clan {
    id: number,
    name: string
    banner: string,
    emblem: string
}
export interface user {
    id: number
    username: string
    clan: clan
    title: title
}

export interface frames {
    x: number,
    y: number
}

export interface inputs {
    up: boolean,
    left: boolean,
    down: boolean,
    right: boolean
}

export interface message {
    content: string
}

export interface Room {
    id: string,
    messages: message[],
    players: player[],
    night: boolean
}

export interface player {
    uid: string,
    user: user | null,
    role: role | null,
    x: number,
    y: number,
    frames: frames,
    inputs: inputs,
    isDead: boolean
}