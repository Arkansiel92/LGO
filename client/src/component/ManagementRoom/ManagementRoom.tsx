import { player, roles, room } from "../../screen/Game/Game";
import { useContext, useEffect, useState } from 'react';
import { socketContext, ExtendedSocket } from '../../context/socket';
import "./ManagementRoom.css";
import Role from "../Role/Role";
import Chat from "../Chat/Chat";

interface props {
    room: room | null
    player: player | undefined
    inGame: boolean
    sideBar: boolean
}

function ManagementRoom({room, player, inGame, sideBar}: props) {

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
        <div className={`col-md-3 bg-dark sidebar-${sideBar}`}>
            <div className="my-3 d-flex justify-content-around">
                <div className='d-flex justify-content-around align-items-center'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" height="17" width="17"><g><circle cx="7" cy="2.5" r="2" fill="none" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round"></circle><path d="M10.5,8a3.5,3.5,0,0,0-7,0V9.5H5l.5,4h3l.5-4h1.5Z" fill="none" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round"></path></g></svg>
                    <div className='mx-2'>
                        {room?.roles.length} / {room?.players.length}
                    </div>
                </div>
                {
                    room?.night
                        ? <div className="d-flex justify-content-around align-items-center id-room">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" height="17" width="17"><path d="M12,10.48A6.55,6.55,0,0,1,6.46.5a6.55,6.55,0,0,0,1,13A6.46,6.46,0,0,0,13,10.39,6.79,6.79,0,0,1,12,10.48Z" fill="none" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                            <span className='mx-2'>
                                Nuit
                            </span>
                        </div>
                        : <div className="d-flex justify-content-around align-items-center id-room">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" height="17" width="17"><g><circle cx="7" cy="7" r="2.5" fill="none" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round"></circle><line x1="7" y1="0.5" x2="7" y2="2.5" fill="none" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round"></line><line x1="2.4" y1="2.4" x2="3.82" y2="3.82" fill="none" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round"></line><line x1="0.5" y1="7" x2="2.5" y2="7" fill="none" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round"></line><line x1="2.4" y1="11.6" x2="3.82" y2="10.18" fill="none" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round"></line><line x1="7" y1="13.5" x2="7" y2="11.5" fill="none" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round"></line><line x1="11.6" y1="11.6" x2="10.18" y2="10.18" fill="none" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round"></line><line x1="13.5" y1="7" x2="11.5" y2="7" fill="none" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round"></line><line x1="11.6" y1="2.4" x2="10.18" y2="3.82" fill="none" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round"></line></g></svg>
                            <span className='mx-2'>
                                Jour
                            </span>
                        </div>
                }
                <div>
                    {
                        roleScreen
                            ? <button className='btn-home' onClick={() => (setRoleScreen(false))}>
                                <div className='d-flex justify-content-around align-items-center'>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" height="17" width="17"><g><circle cx="5" cy="2.75" r="2.25" fill="none" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round"></circle><path d="M3.5,12.5H.5V11A4.51,4.51,0,0,1,7,7" fill="none" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round"></path><polygon points="13.5 8.5 8.79 13.21 6.66 13.5 6.96 11.37 11.66 6.66 13.5 8.5" fill="none" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round"></polygon></g></svg>
                                    <span className="mx-2">
                                        Rôles
                                    </span>
                                </div>
                            </button>
                            : <button className='btn-home' onClick={() => (setRoleScreen(true))}>
                                <div className='d-flex justify-content-around align-items-center'>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" height="17" width="17"><g><circle cx="3.5" cy="7" r="0.5" fill="none" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round"></circle><circle cx="6.75" cy="7" r="0.5" fill="none" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round"></circle><circle cx="10" cy="7" r="0.5" fill="none" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round"></circle><path d="M7,.5A6.5,6.5,0,0,0,1.59,10.6L.5,13.5l3.65-.66A6.5,6.5,0,1,0,7,.5Z" fill="none" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round"></path></g></svg>
                                    <span className="mx-2">
                                        Messages
                                    </span>
                                </div>
                            </button>
                    }
                </div>
            </div>
            {
                roleScreen
                    ? <div className="container-roles my-5 container">
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
                    : <Chat messages={room?.messages} sister={player?.isSister} loved={player?.isCouple} night={room?.night} />
            }

        </div>
    )
}

export default ManagementRoom;