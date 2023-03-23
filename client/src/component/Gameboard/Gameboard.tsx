import { useState, useContext } from "react";
import { socketContext, ExtendedSocket} from "../../context/socket";
import { player, roles } from "../../screen/Game/Game";
import Action from "../Action/Action";
import Actor from "../Actor/Actor";
import BlackWerewolf from "../BlackWerewolf/BlackWerewolf";
import Card from "../Card/Card";
import Counter from "../Counter/Counter";
import Dictator from "../Dictator/Dictator";
import Gypsy from "../Gypsy/Gypsy";
import Hunter from "../Hunter/Hunter";
import Player from "../Player/Player";
import Witch from "../Witch/Witch";

interface props {
    players?: player[],
    player?: player,
    nbTurn?: number,
    victim?: string,
    selfDead: boolean | undefined,
    night: boolean | undefined
}

export interface action {
    name: string,
    descriptionInGame: string,
    response: boolean
}

function Gameboard({players, nbTurn, player, night, selfDead}: props) {

    const [vote, setVote] = useState<boolean>(false);
    const [actionByRole, setActionByRole] = useState<action | null>(null);
    const [action, setAction] = useState<boolean>(false);
    const [wolf, setWolf] = useState<boolean>(false);
    const [roleForActor, setRoleForActor] = useState<roles[]>();
    const [gypsy, setGypsy] = useState<boolean>(false);
    const [dictator, setDictator] = useState<boolean>(false);
    const [witch, setWitch] = useState<boolean>(false);
    const [hunter, setHunter] = useState<boolean>(false);
    const [victim, setVictim] = useState<string | null>(null);
    const [blackWerewolf, setBlackWerewolf] = useState<boolean>(false);
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

    socket.on('hunter', bool => {
        setHunter(bool);
    })

    socket.on('gypsy', bool => {
        setGypsy(bool);
    })

    socket.on('dictator', bool => {
        setDictator(bool);
    })

    socket.on('witch', bool => {
        setWitch(bool);
    })

    socket.on('blackWerewolf', bool => {
        setBlackWerewolf(bool);
    })

    socket.on('victim', victim => {
        setVictim(victim);
    })

    socket.on('actionRole', action => {
        setAction(action);
    })

    socket.on('roleForActor', role => {
        setRoleForActor(role);
    })

    return (
        <div>
            {
                player && <Card player={player} />
            }
            {<Counter />}
            <h4 className="text-start">Tour : {nbTurn}</h4>
            <div className="bg-dark">
                {roleForActor && roleForActor.map((role: roles, index: number) => (
                    <Actor role={role} key={index} />
                ))}

                {dictator && <Dictator />}
                {witch && <Witch vote={victim} />}
                {blackWerewolf && <BlackWerewolf vote={victim} />}
                {gypsy && <Gypsy />}
                {hunter && <Hunter />}
                {actionByRole && <Action name={actionByRole?.name} descriptionInGame={actionByRole?.descriptionInGame} response={actionByRole?.response} />}
            </div>
            <div className="d-flex justify-content-around">
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