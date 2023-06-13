import { CSSProperties } from "react";
import { player } from "../../screen/Game/interface";

function Player({player}: {player: player}) {

    const styles: CSSProperties = {
        position: 'absolute',
        textAlign: 'center',
        top: player.y - 40 + 'px',
        left: player.x + 'px'
    }

    return (
        <div style={styles} className="bg-dark p-1 rounded">
            {player.user?.username}
            <div style={{color: player.user?.title.color, fontSize: "10px"}}>{player.user?.title.title}</div>
        </div>
    )
}

export default Player;