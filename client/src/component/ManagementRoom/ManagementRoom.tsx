import { player, roles, room } from "../../screen/Game/Game";
import { useContext, useEffect, useState } from 'react';
import { socketContext, ExtendedSocket } from '../../context/socket';
import "./ManagementRoom.css";
import Role from "../Role/Role";
import Chat from "../Chat/Chat";

interface props {
    room: room | null
    player: player | undefined
    inGame: boolean | undefined
    sideBar: boolean
    handleChange: (bool: boolean) => void
}

function ManagementRoom({ room, player, inGame, sideBar, handleChange }: props) {

    const [roleScreen, setRoleScreen] = useState(false);
    const [roles, setRoles] = useState<roles[] | null>(null);
    const socket = useContext<ExtendedSocket>(socketContext);

    socket.on('getRoles', (roles) => {
        setRoles(roles);
    })

    useEffect(() => {
        if (!roles) {
            socket.emit('getRoles');
        }

    }, [socket, roles])

    return (
        <div className={`col-md-3 sidebar-${sideBar} px-2`}>
            <div className="my-3 d-flex justify-content-between">
                <div>
                    <button className='btn-home' onClick={() => (setRoleScreen(false))}>
                        <div className='d-flex justify-content-around align-items-center'>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" height="17" width="17"><g><circle cx="3.5" cy="7" r="0.5" fill="none" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round"></circle><circle cx="6.75" cy="7" r="0.5" fill="none" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round"></circle><circle cx="10" cy="7" r="0.5" fill="none" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round"></circle><path d="M7,.5A6.5,6.5,0,0,0,1.59,10.6L.5,13.5l3.65-.66A6.5,6.5,0,1,0,7,.5Z" fill="none" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round"></path></g></svg>
                            <span className="mx-2">
                                Messages
                            </span>
                        </div>
                    </button>
                    <button className='btn-home mx-2' onClick={() => (setRoleScreen(true))}>
                        <div className='d-flex justify-content-around align-items-center'>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" height="17" width="17"><g><circle cx="5" cy="2.75" r="2.25" fill="none" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round"></circle><path d="M3.5,12.5H.5V11A4.51,4.51,0,0,1,7,7" fill="none" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round"></path><polygon points="13.5 8.5 8.79 13.21 6.66 13.5 6.96 11.37 11.66 6.66 13.5 8.5" fill="none" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round"></polygon></g></svg>
                            <span className="mx-2">
                                Rôles
                            </span>
                        </div>
                    </button>
                </div>
                <button className="btn-sidebar" onClick={() => { handleChange(false) }}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" height="25" width="25"><g><line x1="10" y1="7" x2="4" y2="7" fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round"></line><polyline points="5.5 5.5 4 7 5.5 8.5" fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round"></polyline><circle cx="7" cy="7" r="6.5" fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round"></circle></g></svg>
                </button>
            </div>
            {
                roleScreen
                    ? <div className="container-roles container">
                        {roles?.map((role: roles, index: number) => (
                            <Role
                                name={role.name}
                                name_function={role.name_function}
                                description={role.description}
                                side={role.side}
                                max={role.max}
                                img={role.img}
                                roleArray={room?.roles}
                                author={room?.author}
                                inGame={inGame}
                                key={index} />
                        ))}
                    </div>
                    : <Chat messages={room?.messages} player={player} night={room?.night} />
            }
        </div>
    )
}

export default ManagementRoom;