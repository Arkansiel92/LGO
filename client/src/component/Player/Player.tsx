import s from "./Player.module.css";
import { CSSProperties, useState } from "react";
import { player } from "../../screen/Game/interface";

function Player({player}: {player: player}) {
    const [isHovered, setIsHovered] = useState(false);

    const styles: CSSProperties = {
        position: 'absolute',
        textAlign: 'center',
        top: player.y - 80 + 'px',
        left: player.x + 'px',
        transform: "translateX(-25%)",
        backgroundColor: 'rgba(var(--bs-dark-rgb),0.8)'
    }

    return (
        <div style={styles} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} className="p-2 rounded box-shadow">
            <div style={{fontSize:'15px'}}>{player.user?.clan.name}</div>
            <div style={{fontSize:'15px'}}>
                <strong>{player.user?.username}</strong>
            </div>
            <div style={{color: player.user?.title.color, fontSize: "12px"}}>« {player.user?.title.title} »</div>
        </div>
    )
}

export default Player;