import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Gameboard from '../../component/Gameboard/Gameboard';
import ManagementRoom from '../../component/ManagementRoom/ManagementRoom';
import Map from '../../component/Map/Map';
import { socketContext, ExtendedSocket } from '../../context/socket';
import './Game.css';

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
    role: roles | null,
    isPlayed: boolean,
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
    msg: string,
    isDead: boolean,
    sister: boolean,
    loved: boolean
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
    inGame: boolean;
}

function Game() {
    const { id } = useParams<Params>();
    const [room, setRoom] = useState<room | null>(null);
    const [player, setPlayer] = useState<player>();
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

    useEffect(() => {

        if (!room) {
            socket.emit('getRoom');
        }

    }, [socket, room])

    return (
        <div id="container">
            <div id="loader"></div>

            <div className="game-screen container-fluid">
                <div className="row">
                    <ManagementRoom room={room} player={player} inGame={inGame} sideBar={sideBar}/>
                    <div className="col text-center">
                        <button onClick={() => {setSideBar(!sideBar)}} className=''>Sidebar</button>
                        {
                            !inGame &&
                            <div>
                                <div className='id-room my-5 p-3 w-50 m-auto'>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" height="17" width="17"><g><path d="M12.5,10a1,1,0,0,1-1,1H5a1,1,0,0,1-1-1V1.5a1,1,0,0,1,1-1H9.5l3,3Z" fill="none" stroke="#fefefe" strokeLinecap="round" strokeLinejoin="round"></path><path d="M9.5,13.5h-7a1,1,0,0,1-1-1v-9" fill="none" stroke="#fefefe" strokeLinecap="round" strokeLinejoin="round"></path></g></svg>
                                    <span className='mx-2'>
                                        {id}
                                    </span>
                                </div>
                                {
                                    room?.players?.length === room?.roles?.length && socket.id === room?.author && 
                                    <button className="btn btn-success btn-lg" onClick={() => { socket.emit('inGame', true) }}>Lancer la partie</button>
                                }
                            </div>
                        }
                        {
                            inGame && 
                            <Gameboard 
                                players={room?.players} 
                                nbTurn={room?.nbTurn} 
                                player={player} 
                                night={room?.night} 
                                selfDead={player?.isDead} 
                                selfVote={player?.isVote} 
                                victim={room?.voteWolf} />
                        }
                        {/* <Map /> */}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Game;