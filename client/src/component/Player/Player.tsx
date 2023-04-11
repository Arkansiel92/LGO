import { CSSProperties, useContext } from 'react';
import { player } from "../../screen/Game/Game";
import { ExtendedSocket, socketContext } from '../../context/socket';
import "./Player.css";

interface props{
    player: player,
    selfPlayer: player | undefined,
    step: string
}

function Player({player, selfPlayer, step}: props) {

    const socket = useContext<ExtendedSocket>(socketContext);

    const style: CSSProperties = {
        display: 'inline-block',
        position: 'absolute',
        left: player.x,
        top: player.y - 10,
        fontSize: "20px",
        cursor: selfPlayer?.isTurn ? 'pointer' : 'default'
    }

    const handleSubmit = () => {
        if (selfPlayer?.isTurn) {
            if (step !== "werewolf" && step !== "village") {
                socket.emit('set' + selfPlayer?.role?.name_function, player.socket);
            } 
            
            if (step === "village" && selfPlayer?.isVote) {
                socket.emit('voteVillage', player.socket);
            }

            if (step === "werewolf") {
                socket.emit('voteWolf', player.socket);
            }
        }
    }

    return (
        <div>
        {
        !player.isDead && 
            <div style={style} className='position-absolute'>
                <div  onClick={handleSubmit} className="d-flex align-items-center rounded p-1 my-1" id="player-banner">
                    {
                        player.isMayor && <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" height="15" width="15"><path d="M13.5,4l-3,3L7,2,3.5,7,.5,4v6.5A1.5,1.5,0,0,0,2,12H12a1.5,1.5,0,0,0,1.5-1.5Z" fill="none" stroke="#ffec00" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                    }
                    {
                        (selfPlayer?.role?.name_function === "Flute" && player.isCharmed) && <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" height="15" width="15"><g><ellipse cx="7" cy="3" rx="6" ry="2.5" fill="none" stroke="#880ae7" stroke-linecap="round" stroke-linejoin="round"></ellipse><path d="M11.87,6.73C11,7.52,9.14,8.07,6.93,8.07A10.17,10.17,0,0,1,3,7.37" fill="none" stroke="#880ae7" stroke-linecap="round" stroke-linejoin="round"></path><path d="M10.86,9.84a6.84,6.84,0,0,1-3.36.73A8.47,8.47,0,0,1,5,10.22" fill="none" stroke="#880ae7" stroke-linecap="round" stroke-linejoin="round"></path><path d="M10.37,13.44c-.95.21-1.83-.16-2-.83" fill="none" stroke="#880ae7" stroke-linecap="round" stroke-linejoin="round"></path></g></svg>
                    }
                    {
                        (player?.role?.side === "méchant" || player?.isInfected) && (selfPlayer?.role?.side === "méchant" || selfPlayer?.isInfected) && <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" height="15" width="15"><g><path d="M8.92,1.25a3.2,3.2,0,1,1-3.84,0" fill="none" stroke="#780505" stroke-linecap="round" stroke-linejoin="round"></path><path d="M.5,9.17a3.2,3.2,0,1,1,1.92,3.32" fill="none" stroke="#780505" stroke-linecap="round" stroke-linejoin="round"></path><path d="M11.58,12.49A3.19,3.19,0,1,1,13.5,9.17" fill="none" stroke="#780505" stroke-linecap="round" stroke-linejoin="round"></path></g></svg>
                    }
                    {player.name}
                </div>
                <img src="assets/img/sprites/playerBlue.png" className='mx-auto d-block' alt="" />
            </div>
        }
        </div>
    )
};

export default Player;