import { useState, useContext } from "react";
import { socketContext, ExtendedSocket} from "../../context/socket";
import { player, roles } from "../../screen/Game/Game";
import Actor from "../Actor/Actor";
import Card from "../Card/Card";
import Counter from "../Counter/Counter";
import Dictator from "../Dictator/Dictator";
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
    const [wolf, setWolf] = useState<boolean>(false);
    const [roleForActor, setRoleForActor] = useState<roles[]>();
    const [dictator, setDictator] = useState<boolean>(false);
    const socket = useContext<ExtendedSocket>(socketContext);

    socket.on('setIsVote', vote => {
        setVote(vote);
    })

    socket.on('setWolf', bool => {
        setWolf(bool);
    })

    socket.on('dictator', bool => {
        setDictator(bool);
    })

    socket.on('action', action => {
        setAction(action);
    })

    socket.on('roleForActor', role => {
        setRoleForActor(role);
        console.log(role);
    })

    return (
        <div>
            {<Counter />}
            <h4 className="text-start">{night ? "Période : nuit" : "Période : jour" }</h4>
            <h4 className="text-start">Tour : {nbTurn}</h4>
            {
                player && <Card player={player} />
            }
            <div className="bg-dark">
                {roleForActor && roleForActor.map((role: roles, index: number) => (
                    <Actor role={role} />
                ))}

                {dictator && <Dictator />}
            </div>
            <div className="d-flex justify-content-around">
                {players?.map((p: player, index: number) => (
                    <Player
                        name_function={player?.role?.name_function}
                        name={p.name}
                        socket={p.socket}
                        isDead={p.isDead}
                        isTurn={p.isTurn}
                        isPower={p.isPower}
                        isCouple={p.isCouple}
                        wolf={wolf}
                        night={night}
                        action={action}
                        vote={vote}
                        key={index} />
                ))}
            </div>
        </div>
    )
};

export default Gameboard;