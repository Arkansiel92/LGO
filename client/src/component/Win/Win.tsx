import { room } from "../../screen/Game/Game";
import { useContext } from "react";
import "./Win.css";
import { ExtendedSocket, socketContext } from "../../context/socket";

interface props {
    room: room
    author: string
    side: string | undefined
}

function Win({room, author, side}: props) {

    const socket = useContext<ExtendedSocket>(socketContext);

    return (
        <div id="win" className="card w-50 m-auto bg-dark text-center">
            {
                room?.winner === "sisters" && <h1 className="text-success">Les soeurs ont gagné !</h1>
            }
            {
                room?.winner === "lovers" && <h1 className="text-success">Les amoureux ont gagné !</h1>
            }
            {
                (side === room?.winner && room?.winner !== "lovers" && room?.winner !== "sisters") && <h1 className="text-success">Vous avez gagné !</h1>
            }
            {
                (side !== room?.winner && room?.winner !== "lovers" && room?.winner !== "sisters") && <h1 className="text-danger">Vous avez perdu !</h1>
            }
            <div className="my-2">
                <h3>Liste des joueurs</h3>
                {room?.players?.map((player, index) => (
                    <div key={index}>
                        {
                            player?.role?.side === "village" && <span className="text-success">- {player.name} ({player.role?.name}) {player.isInfected && "(infecté)"} {player.isCouple && "(couple)"} {player.isSister && "(soeur)"}</span>
                        }
                        {
                            player?.role?.side === "méchant" && <span className="text-danger">- {player.name} ({player.role?.name}) {player.isInfected && "(infecté)"} {player.isCouple && "(couple)"} {player.isSister && "(soeur)"}</span>
                        }
                        {
                            player?.role?.side === "seul" && <span className="text-warning">- {player.name} ({player.role?.name}) {player.isInfected && "(infecté)"} {player.isCouple && "(couple)"} {player.isSister && "(soeur)"}</span>
                        }
                    </div>
                ))}
            </div>
            {
                author === socket.id &&
                <button onClick={() => {socket.emit('resetGame')}} className="btn btn-lg w-25 m-auto btn-success my-2">Rejouer</button>
            }
        </div>
    )
}

export default Win;