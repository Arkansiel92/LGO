import { useState, useContext } from "react";
import { socketContext, ExtendedSocket} from "../../context/socket";
import { player, roles } from "../../screen/Game/Game";
import Action from "../Action/Action";
import Card from "../Card/Card";
import Counter from "../Counter/Counter";
import Player from "../Player/Player";

interface props {
    players?: player[],
    player?: player,
    nbTurn?: number,
    victim?: string,
    selfDead: boolean | undefined,
    night: boolean | undefined
}

interface event {
    name: string,
    description: string
}

export interface action {
    name: string,
    name_function?: string,
    descriptionInGame: string,
    response: boolean,
    victim? : string,
    actorRoles?: roles[],
    gypsy? : event[],
    witch? : {
        potion: boolean,
        death: boolean
    }
}

function Gameboard({players, nbTurn, player, night, selfDead}: props) {

    const [vote, setVote] = useState<boolean>(false);
    const [actionByRole, setActionByRole] = useState<action | null>(null);
    const [action, setAction] = useState<boolean>(false);
    const [wolf, setWolf] = useState<boolean>(false);
    const socket = useContext<ExtendedSocket>(socketContext);

    socket.on('actionByRole', (data) => {
        setActionByRole(data);        
    })

    socket.on('setIsVote', vote => {
        setVote(vote);
    })

    socket.on('setWolf', bool => {
        setWolf(bool);
    })

    socket.on('action', action => {
        setAction(action);
    })

    return (
        <div className="position-relative">
            {<Counter />}
            {player && <Card player={player} />}
            <h4 className="text-start">Tour : {nbTurn}</h4>
            {actionByRole && <Action 
                name={actionByRole?.name} 
                name_function={actionByRole?.name_function}
                descriptionInGame={actionByRole?.descriptionInGame} 
                response={actionByRole?.response} 
                victim={actionByRole?.victim}
                actorRoles={actionByRole?.actorRoles}
                gypsy={actionByRole?.gypsy} />}

            <div className="d-flex justify-content-around m-5">
                {players?.map((p: player, index: number) => (
                    <Player
                        selfDead={selfDead}
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