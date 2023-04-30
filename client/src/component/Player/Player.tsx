import { CSSProperties, useContext } from 'react';
import { player } from "../../screen/Game/Game";
import { ExtendedSocket, socketContext } from '../../context/socket';
import "./Player.css";
import Title from '../Title/Title';

interface props {
    player: player,
    selfPlayer: player | undefined,
    step: string
}

function Player({ player, selfPlayer, step }: props) {

    const socket = useContext<ExtendedSocket>(socketContext);

    const style: CSSProperties = {
        display: 'inline-block',
        position: 'absolute',
        left: player.x + "%",
        top: player.y + "%",
        fontSize: "20px",
        cursor: selfPlayer?.isTurn ? 'pointer' : 'default'
    }

    const handleSubmit = () => {
        if (selfPlayer?.isTurn) {
            if ((step === "village" && selfPlayer?.isVote) || (step === "parkRanger" && selfPlayer?.isVote)) {
                socket.emit('voteVillage', player.socket);
            } else if (step === "werewolf") {
                socket.emit('voteWolf', player.socket);
            } else if (step === "mayor") {
                if (selfPlayer.isMayor) {
                    socket.emit('setParkerRanger', player.socket)
                }
            } else {
                socket.emit('set' + selfPlayer?.role?.name_function, player.socket);
            }
        }
    }

    return (
        <div>
            <div style={style} onClick={handleSubmit} className='position-absolute'>
                <div id="player-banner" className='rounded p-1 my-1'>
                    <div className="d-flex align-items-center justify-content-around">
                        {
                            player.isParkRanger && <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" height="17" width="17"><g><path d="M7.36,13.43h0a1,1,0,0,1-.72,0h0a9.67,9.67,0,0,1-6.14-9V1.5a1,1,0,0,1,1-1h11a1,1,0,0,1,1,1V4.42A9.67,9.67,0,0,1,7.36,13.43Z" fill="none" stroke="#0b6ea8" strokeLinecap="round" strokeLinejoin="round"></path><rect x="4.5" y="5.5" width="5" height="4" rx="1" fill="none" stroke="#0b6ea8" strokeLinecap="round" strokeLinejoin="round"></rect><path d="M8.5,5.5v-1a1.5,1.5,0,1,0-3,0v1" fill="none" stroke="#0b6ea8" strokeLinecap="round" strokeLinejoin="round"></path></g></svg>
                        }
                        {
                            (player.isCouple && selfPlayer?.isCouple) && <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" height="17" width="17"><path d="M7,12.45l-5.52-5c-3-3,1.41-8.76,5.52-4.1,4.11-4.66,8.5,1.12,5.52,4.1Z" fill="none" stroke="#336c87" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                        }
                        {
                            (player.isSister && selfPlayer?.isSister) && <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" height="17" width="17"><g><circle cx="5" cy="3.75" r="2.25" fill="none" stroke="#5e0472" strokeLinecap="round" strokeLinejoin="round"></circle><path d="M9.5,13.5H.5v-1a4.5,4.5,0,0,1,9,0Z" fill="none" stroke="#5e0472" strokeLinecap="round" strokeLinejoin="round"></path><path d="M9,1.5A2.25,2.25,0,0,1,9,6" fill="none" stroke="#5e0472" strokeLinecap="round" strokeLinejoin="round"></path><path d="M10.6,8.19a4.5,4.5,0,0,1,2.9,4.2V13.5H12" fill="none" stroke="#5e0472" strokeLinecap="round" strokeLinejoin="round"></path></g></svg>
                        }
                        {
                            player.isMayor && <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" height="15" width="15"><path d="M13.5,4l-3,3L7,2,3.5,7,.5,4v6.5A1.5,1.5,0,0,0,2,12H12a1.5,1.5,0,0,0,1.5-1.5Z" fill="none" stroke="#ffec00" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                        }
                        {
                            (selfPlayer?.role?.name_function === "Flute" && player.isCharmed) && <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" height="15" width="15"><g><ellipse cx="7" cy="3" rx="6" ry="2.5" fill="none" stroke="#880ae7" strokeLinecap="round" strokeLinejoin="round"></ellipse><path d="M11.87,6.73C11,7.52,9.14,8.07,6.93,8.07A10.17,10.17,0,0,1,3,7.37" fill="none" stroke="#880ae7" strokeLinecap="round" strokeLinejoin="round"></path><path d="M10.86,9.84a6.84,6.84,0,0,1-3.36.73A8.47,8.47,0,0,1,5,10.22" fill="none" stroke="#880ae7" strokeLinecap="round" strokeLinejoin="round"></path><path d="M10.37,13.44c-.95.21-1.83-.16-2-.83" fill="none" stroke="#880ae7" strokeLinecap="round" strokeLinejoin="round"></path></g></svg>
                        }
                        {
                            (player?.role?.side === "méchant" || player?.isInfected) && (selfPlayer?.role?.side === "méchant" || selfPlayer?.isInfected) && <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" height="15" width="15"><g><path d="M8.92,1.25a3.2,3.2,0,1,1-3.84,0" fill="none" stroke="#780505" strokeLinecap="round" strokeLinejoin="round"></path><path d="M.5,9.17a3.2,3.2,0,1,1,1.92,3.32" fill="none" stroke="#780505" strokeLinecap="round" strokeLinejoin="round"></path><path d="M11.58,12.49A3.19,3.19,0,1,1,13.5,9.17" fill="none" stroke="#780505" strokeLinecap="round" strokeLinejoin="round"></path></g></svg>
                        }
                        <span>{player.name}</span>
                    </div>
                    <Title title='vendeur de shit' color='#108355' />
                </div>
                {
                    !player.isDead
                        ? <img src="assets/img/sprites/player3.png" className='mx-auto d-block' alt="" />
                        : <img src="assets/img/sprites/player3_dead.png" className='mx-auto d-block' alt="" />
                }

            </div>
        </div>
    )
};

export default Player;