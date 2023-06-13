interface title {
    title: string,
    color: string
}

export interface role {

}

export interface user {
    id: number
    username: string
    clan: number
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