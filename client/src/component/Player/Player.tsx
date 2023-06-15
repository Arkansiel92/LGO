import s from "./Player.module.css";
import { CSSProperties } from "react";
import { player } from "../../screen/Game/interface";

function Player({player}: {player: player}) {

    const styles: CSSProperties = {
        position: 'absolute',
        textAlign: 'center',
        top: player.y - 80 + 'px',
        left: player.x + 'px',
        transform: "translateX(-25%)",
        backgroundColor: 'rgba(var(--bs-dark-rgb),0.8)'
    }

    return (
        <div style={styles} className="p-3 rounded box-shadow">
            <div className="row">
                <div className="col-3 p-0 position-relative">
                    <img src={player.user?.clan.banner} className={s.banner} alt="" width={20} />
                    <img src={player.user?.clan.emblem} className={s.emblem} alt="" width={10} />
                </div>
                <div className="col p-0">
                    <div style={{fontSize:'15px'}}>{player.user?.username}</div>
                    <div style={{color: player.user?.title.color, fontSize: "10px"}}>« {player.user?.title.title} »</div>
                </div>
            </div>
        </div>
    )
}

export default Player;