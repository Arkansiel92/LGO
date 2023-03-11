import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Role from '../../component/Role';
import {socketContext, ExtendedSocket} from '../../context/socket';
import './Game.css';

type Params = {
    id: string
}

export interface roles {
    name: string,
    description: string,
    side: string,
    max: number
}

function Game() {

    const { id } = useParams<Params>();
    const [roles, setRoles] = useState<roles[] | null>(null);
    const socket = useContext<ExtendedSocket>(socketContext);

    
    socket.on('getRoles', (roles) => {
        setRoles(roles);
        console.log(roles);
    })

    useEffect(() => {
        if (!roles) {
            socket.emit('getRoles');
            console.log("coucou");
            
        }
    }, [socket, roles])

    return (
        <div className='container-fluid'>
            <div className="row">
                <div className="col-md-2 d-none d-md-block bg-light sidebar">
                </div>
                <div className="col">
                    <div className="row my-5 container m-auto">
                        <h2 className='text-center my-3'>Choissisez les rôles</h2>
                        {roles?.map((role: roles, index: number) => (
                            <Role name={role.name} description={role.description} side={role.side} max={role.max} key={index} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Game;