import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Chat from '../../component/Chat/Chat';
import Role from '../../component/Role/Role';
import {socketContext, ExtendedSocket} from '../../context/socket';
import './Game.css';

type Params = {
    id: string
}

export interface roles {
    name: string,
    description: string,
    side: string,
    img: string,
    max: number
}

export interface room {
    status?: string,
    author?: string,
    players?: string[],
    roles?: string[],
    votes?: string[]
}

function Game() {

    const { id } = useParams<Params>();
    const [roles, setRoles] = useState<roles[] | null>(null);
    const [room, setRoom] = useState<room | null>(null);
    const socket = useContext<ExtendedSocket>(socketContext);

    socket.on('getRoom', room => {
        setRoom(room);
        console.log(room);
    })
    
    socket.on('getRoles', (roles) => {
        setRoles(roles);
        console.log(roles);
    })

    useEffect(() => {
        if (!roles) {
            socket.emit('getRoles');
        }

        if (!room) {
            socket.emit('getRoom');
        }
    }, [socket, roles, room])

    return (
        <div className='game screen container-fluid'>
            <div className="row">
                <div className="col-md-2 d-none d-md-block bg-light sidebar">
                    <Chat />
                </div>
                <div className="col">
                    <div className="card bg-light container m-auto my-5">
                            <div className="">
                                <h2 className='my-3'>Choissisez les rôles ({room?.roles?.length} / {room?.players?.length})</h2>
                                {roles?.map((role: roles, index: number) => (
                                    <Role 
                                    name={role.name} 
                                    description={role.description} 
                                    side={role.side} 
                                    max={role.max}
                                    img={role.img}
                                    roleArray={room?.roles}
                                    author={room?.author}
                                    key={index} />
                                ))}
                            </div>
                            {
                                room?.players?.length === room?.roles?.length 
                                ? <button className="btn btn-success btn-lg">Lancer la partie</button>
                                : <button disabled className="btn btn-success btn-lg">Lancer la partie</button>
                            }
                    </div>
                    <div className="card container bg-light p-3 text-center">Identifiant : {id}</div>
                </div>
            </div>
        </div>
    )
}

export default Game;