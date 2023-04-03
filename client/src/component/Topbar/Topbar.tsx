import { player, room } from "../../screen/Game/Game";
import "./Topbar.css";

interface props {
    room: room | null
    player: player | undefined
}

function Topbar({ room, player }: props) {
    return (
        <div id="topbar" className="d-flex justify-content-around bg-dark p-2">
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
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" height="17" width="17"><g><path d="M1.77,8.5A5.91,5.91,0,0,1,.5,4.84V1.58a9.65,9.65,0,0,1,8.87,0" fill="none" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round"></path><path d="M7.79,13.44h0a2.27,2.27,0,0,1-2-.51h0A6.66,6.66,0,0,1,3.68,6.26l.73-2.92A9.88,9.88,0,0,1,13.5,5.62l-.73,2.91A6.67,6.67,0,0,1,7.79,13.44Z" fill="none" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round"></path><path d="M5.61,6.51a1,1,0,0,1,1-.27,1,1,0,0,1,.73.69" fill="none" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round"></path><path d="M9.57,7.5a1,1,0,0,1,1.7.43" fill="none" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round"></path></g></svg>

                {
                    player?.role
                        ? <span> {player?.role.name}</span>
                        : <span> aucun rôle</span>
                }
            </div>
        </div>
    )
};

export default Topbar;