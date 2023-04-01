import { CSSProperties, useContext } from 'react';
import { player } from "../../screen/Game/Game";
import { ExtendedSocket, socketContext } from '../../context/socket';
import "./PlayerB.css";

interface props{
    player: player
}


function PlayerB({player}: props) {

    const socket = useContext<ExtendedSocket>(socketContext);

    const style: CSSProperties = {
        display: 'inline-block',
        position: 'absolute',
        left: player.x,
        top: player.y - 10,
        fontSize: "15px",
        cursor:'pointer'
    }

    return (
        <div style={style} className="bg-dark rounded p-1" id="player-banner">
            {player.name}
        </div>
    )
};

export default PlayerB;