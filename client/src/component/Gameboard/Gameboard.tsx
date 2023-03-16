import { useState, useContext } from "react";
import { socketContext, ExtendedSocket} from "../../context/socket";
import { player } from "../../screen/Game/Game";
import Card from "../Card/Card";
import Player from "../Player/Player";

interface props {
    players?: player[],
    player?: player,
    nbTurn?: number,
    night: boolean
}

function Gameboard({players, nbTurn, player, night}: props) {

    const [vote, setVote] = useState<boolean>(false);
    const [action, setAction] = useState<boolean>(false);
    const socket = useContext<ExtendedSocket>(socketContext);

    socket.on('setIsVote', vote => {
        setVote(vote);
    })

    socket.on('action', action => {
        setAction(action);
    })

    return (
        <div>
            {
                player && <Card player={player} />
            }
            {
                night 
                ? <h4 className="text-start">Période : nuit</h4> 
                : <h4 className="text-start">Période : jour</h4>
            }
            <h4 className="text-start">Tour : {nbTurn}</h4>
            {players?.map((p: player, index: number) => (
                <Player
                    name_function={player?.role?.name_function}
                    name={p.name}
                    socket={p.socket}
                    isDead={p.isDead}
                    isTurn={p.isTurn}
                    isPower={p.isPower}
                    isCouple={p.isCouple}
                    night={night}
                    action={action}
                    vote={vote}
                    key={index} />
            ))}
        </div>
    )
};

export default Gameboard;