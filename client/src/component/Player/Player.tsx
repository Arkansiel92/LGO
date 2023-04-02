import { CSSProperties, useContext } from 'react';
import { player } from "../../screen/Game/Game";
import { ExtendedSocket, socketContext } from '../../context/socket';
import "./Player.css";

interface props{
    player: player,
    role_function: string | undefined
    night: boolean
}


function Player({player, role_function, night}: props) {

    const socket = useContext<ExtendedSocket>(socketContext);

    const style: CSSProperties = {
        display: 'inline-block',
        position: 'absolute',
        left: player.x,
        top: player.y - 10,
        fontSize: "15px",
        cursor:'pointer'
    }

    const handleSubmit = () => {
        if (night) {
            socket.emit('set' + role_function, player.socket);
        } else {
            socket.emit('voteVillage', player.socket);
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