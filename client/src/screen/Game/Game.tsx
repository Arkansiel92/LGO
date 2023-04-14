import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ManagementRoom from '../../component/ManagementRoom/ManagementRoom';
import { socketContext, ExtendedSocket } from '../../context/socket';
import './Game.css';
import Player from '../../component/Player/Player';
import Topbar from '../../component/Topbar/Topbar';
import BoxRole from '../../component/BoxRole/BoxRole';
import { event } from '../../component/Event/Event';
import Votes from '../../component/Votes/Votes';
import Cloud from '../../component/Cloud/Cloud';
import Mayor from '../../component/Mayor/Mayor';
import Options from '../../component/Options/Options';
import Win from '../../component/Win/Win';

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
    vote: string | null,
    votes: string[],
    isMayor: boolean,
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

export interface mayor {
    name: string,
    content: string,
    votes: string[]
}

export interface room {
    status: string,
    author: string,
    players: player[],
    roles: string[],
    votes: string[],
    mayorDialog: mayor[],
    messages: message[],
    night: boolean,
    nbTurn: number;
    voteWolf: string,
    inGame: boolean
    winner: string | null
    step: string
}

interface boxRole {
    description: string
    role: string
    victim: string | null
    type?: string
    title?: string
    health?: boolean
    death?: boolean
    setYes?: boolean
    setNo?: boolean
    textarea?: boolean
    eventsGypsy?: event[]
    actor?: roles[]
}

function Game() {
    const { id } = useParams<Params>();
    const [room, setRoom] = useState<room | null>(null);
    const [player, setPlayer] = useState<player>();
    const [boxRole, setBoxRole] = useState<boxRole | undefined>();
    const [sideBar, setSideBar] = useState<boolean>(true);
    const socket = useContext<ExtendedSocket>(socketContext);

    socket.on('getRoom', room => {
        setRoom(room);

        const player = room?.players.find((player: player) => {
            return player.socket === socket.id
        })

        setPlayer(player);
    })

    socket.on('boxRole', box => {
        setBoxRole(box);
    })

    useEffect(() => {
        if (!room) {
            socket.emit('getRoom');
        }
    }, [socket, room]);

    return (
        <div id="container" style={{ 
            backgroundImage: `url(${process.env.PUBLIC_URL + '/assets/maps/background-game.svg'})`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center bottom',
            backgroundColor: room?.night ? "#23323D" : "#87CEEB",
            width: window.innerWidth,
            height: window.innerHeight
          }}>
            <div id="loader"></div>
            
            <Topbar room={room} player={player} />

            <div className='position-absolute'>
            {
                room?.night 
                ? <img className='moon m-5' src="/assets/img/sprites/moon_full.png" alt="moon" />
                : <img className='moon m-5' src="/assets/img/sprites/sun.png" alt="moon" />
            }
            <Cloud nb={2} animationDelay={18} left={800} top={10} />
            <Cloud nb={2} animationDelay={30} left={600} top={40} />
            <Cloud nb={2} animationDelay={22} left={300} top={80} />
            <Cloud nb={2} animationDelay={18} left={1200} top={30} />
            </div>


            {player?.isTurn && <BoxRole
                description={boxRole?.description}
                victim={boxRole?.victim}
                name_function={player?.role?.name_function}
                type={boxRole?.type}
                title={boxRole?.title}
                role={boxRole?.role}
                health={boxRole?.health}
                death={boxRole?.death}
                setYes={boxRole?.setYes}
                setNo={boxRole?.setNo}
                eventsGypsy={boxRole?.eventsGypsy}
                actor={boxRole?.actor} 
                textarea={boxRole?.textarea} />}


            <ManagementRoom room={room} player={player} inGame={room?.inGame} sideBar={sideBar} />

            {room?.players?.map((p: player, index: number) => (
                <Player
                player={p}
                selfPlayer={player}
                step={room?.step}
                key={index} />
                ))}

            <div className="game-screen">
                <div className="container-fluid">
                    {room?.step === "overview" && <Win room={room} author={room?.author} side={player?.role?.side} />}
                    <div className="text-end">
                        <button className="btn btn-info mt-5" onClick={() => { setSideBar(!sideBar) }}>Rôles & Messages</button>
                    </div>
                    {
                        room?.step === "village" && <Votes players={room?.players} />
                    }
                    {
                        room?.step === "mayor" && <Mayor candidates={room?.mayorDialog} />
                    }
                    <div className="col text-center">
                        {
                            !room?.inGame &&
                            <div>
                                <div onClick={() => { navigator.clipboard.writeText(window.location.host + "?id=" + id) }} className='id-room my-5 p-3 w-25 m-auto' data-bs-toggle="tooltip" data-bs-placement="top" title="copier le lien" data-bs-custom-class="tooltip">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" height="17" width="17"><g><path d="M12.5,10a1,1,0,0,1-1,1H5a1,1,0,0,1-1-1V1.5a1,1,0,0,1,1-1H9.5l3,3Z" fill="none" stroke="#fefefe" strokeLinecap="round" strokeLinejoin="round"></path><path d="M9.5,13.5h-7a1,1,0,0,1-1-1v-9" fill="none" stroke="#fefefe" strokeLinecap="round" strokeLinejoin="round"></path></g></svg>
                                    <span className='mx-2'>
                                        {window.location.host}?id={id}
                                    </span>
                                </div>
                                <div className='w-25 m-auto my-5'>
                                    <Options room={room} />
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Game;