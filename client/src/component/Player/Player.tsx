import { CSSProperties, useContext } from 'react';
import { player } from "../../screen/Game/Game";
import { ExtendedSocket, socketContext } from '../../context/socket';
import "./Player.css";

interface props{
    player: player,
    role_function: string | undefined
    isTurn: boolean | undefined
    step: string
}


function Player({player, role_function, isTurn, step}: props) {

    const socket = useContext<ExtendedSocket>(socketContext);

    const style: CSSProperties = {
        display: 'inline-block',
        position: 'absolute',
        left: player.x,
        top: player.y - 10,
        fontSize: "15px",
        cursor: isTurn ? 'pointer' : 'default'
    }

    const handleSubmit = () => {
        if (isTurn) {
            if (step !== "werewolf" && step !== "day") {
                socket.emit('set' + role_function, player.socket);
            } 
            
            if (step === "day") {
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
            <div style={style} onClick={handleSubmit} className="bg-dark rounded p-1" id="player-banner">
                {player.name}
            </div>
        }
        </div>
    )
};

export default Player;