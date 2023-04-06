import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ManagementRoom from '../../component/ManagementRoom/ManagementRoom';
import Map from '../../component/Map/Map';
import { socketContext, ExtendedSocket } from '../../context/socket';
import './Game.css';
import Player from '../../component/Player/Player';
import Topbar from '../../component/Topbar/Topbar';
import BoxRole from '../../component/BoxRole/BoxRole';
import { event } from '../../component/Event/Event';
import Counter from '../../component/Counter/Counter';
import Votes from '../../component/Votes/Votes';

type Params = {
    id: string
}

export interface roles {
    name: string,
    name_function: string,
    description: string,
    descriptionInGame: string,
    side: string,
    img: string,
    max: number
}

export interface player {
    name: string,
    socket: string,
    x: number,
    y: number,
    frameX: number,
    frameY: number,
    role: roles | null,
    isVote: boolean,
    isDead: boolean,
    isTurn: boolean,
    isPower: boolean,
    isCouple: boolean,
    isSister: boolean,
    isCharmed: boolean,
    isRaven: boolean,
    isProtected: boolean,
    isInfected: boolean,
    healthPotion: boolean,
    deathPotion: boolean
}

export interface message {
    socket: string | null,
    author: string | null,
    recipient: string | null,
    type: string,
    msg: string,
    isDead: boolean,
}

export interface room {
    status: string,
    author: string,
    players: player[],
    roles: string[],
    votes: string[],
    messages: message[],
    night: boolean,
    nbTurn: number;
    voteWolf: string,
    inGame: boolean
    step: string
}

interface boxRole {
    description: string
    role: string
    victim: string | null
    health?: boolean
    death?: boolean
    setYes?: boolean
    setNo?: boolean
    eventsGypsy?: event[]
    actor?: roles[]
}

function Game() {
    const { id } = useParams<Params>();
    const [room, setRoom] = useState<room | null>(null);
    const [player, setPlayer] = useState<player>();
    const [boxRole, setBoxRole] = useState<boxRole>();
    const [inGame, setInGame] = useState<boolean>(false);
    const [sideBar, setSideBar] = useState<boolean>(true);
    const socket = useContext<ExtendedSocket>(socketContext);

    socket.on('getRoom', room => {
        setRoom(room);

        const player = room?.players.find((player: player) => {
            return player.socket === socket.id
        })

        setPlayer(player);
    })

    socket.on('inGame', bool => {
        setInGame(bool)
    })

    socket.on('boxRole', box => {
        setBoxRole(box);
        
    })

    useEffect(() => {
        if (!room) {
            socket.emit('getRoom');
        }
    }, [socket, room])

    return (
        <div id="container">
            <div id="loader"></div>

            <Topbar room={room} player={player}/>

            {boxRole && <BoxRole 
                description={boxRole.description} 
                victim={boxRole.victim}
                name_function={player?.role?.name_function} 
                role={boxRole.role} 
                health={boxRole.health}
                death={boxRole.death}
                setYes={boxRole.setYes}
                setNo={boxRole.setNo} 
                eventsGypsy={boxRole.eventsGypsy}
                actor={boxRole.actor} />}

            <ManagementRoom room={room} player={player} inGame={inGame} sideBar={sideBar}/>

            <Map room={room} />

            {room?.players?.map((p: player, index: number) => (
            <Player
                player={p}
                role_function={player?.role?.name_function}
                isTurn={player?.isTurn}
                step={room?.step}
                key={index} />
            ))}

            <div className="game-screen">
                <div className="container-fluid">
                    <div className="text-end">
                        <button className="btn btn-info mt-5" onClick={() => {setSideBar(!sideBar)}}>Rôles & Messages</button>
                    </div>
                    {
                        !player?.isTurn && inGame && <Counter />
                    }
                    <div>
                    {
                        room?.step === "village" && <Votes players={room?.players} />
                    }
                    </div>
                    <div className="col text-center">
                        {
                            !inGame &&
                            <div>
                                <div onClick={() => {navigator.clipboard.writeText(window.location.host + "?id=" + id)}} className='id-room my-5 p-3 w-50 m-auto' data-bs-toggle="tooltip" data-bs-placement="top" title="copier le lien" data-bs-custom-class="tooltip">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" height="17" width="17"><g><path d="M12.5,10a1,1,0,0,1-1,1H5a1,1,0,0,1-1-1V1.5a1,1,0,0,1,1-1H9.5l3,3Z" fill="none" stroke="#fefefe" strokeLinecap="round" strokeLinejoin="round"></path><path d="M9.5,13.5h-7a1,1,0,0,1-1-1v-9" fill="none" stroke="#fefefe" strokeLinecap="round" strokeLinejoin="round"></path></g></svg>
                                    <span className='mx-2'>
                                        {window.location.host}?id={id}
                                    </span>
                                </div>
                                {
                                    room?.players?.length === room?.roles?.length && socket.id === room?.author && 
                                    <button className="btn btn-success btn-lg" onClick={() => { socket.emit('inGame', true) }}>Lancer la partie</button>
                                }
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Game;