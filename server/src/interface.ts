interface title {
    title: string,
    color: string
}

interface clan {
    id: number,
    banner: string,
    emblem: string
}

export interface role {

}

export interface user {
    id: number
    username: string
    clan: clan
    title: title
}

export interface player {
    uid: string,
    user: user | null,
    role: role | null,
    x: number,
    y: number,
    frames: frames,
    isDead: boolean
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