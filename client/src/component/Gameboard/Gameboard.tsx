import { useState, useContext } from "react";
import { socketContext, ExtendedSocket} from "../../context/socket";
import { player } from "../../screen/Game/Game";
import Player from "../Player/Player";

interface props {
    players?: player[]
}


function Gameboard({players}: props) {

    const [role, setRole] = useState<string>("");
    const [night, setNight] = useState<boolean>(false);
    const socket = useContext<ExtendedSocket>(socketContext);

    socket.on('getRole', role => {
        setRole(role);
        console.log(role);
    })

    socket.on('night', bool => {
        setNight(bool);
    })

    return (
        <div>
            <h1>Ton rôle : {role}</h1>
            {players?.map((player: player, index: number) => (
                <Player
                    name={player.name}
                    socket={player.socket}
                    role={player.role}
                    turn={player.turn}
                    isPower={player.isPower}
                    couple={player.couple}
                    night={night}
                    key={index} />
            ))}
        </div>
    )
};

export default Gameboard;