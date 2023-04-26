import { room } from "../../screen/Game/Game";
import { useContext } from "react";
import "./Options.css";
import { ExtendedSocket, socketContext } from "../../context/socket";

interface props {
    room: room | null
}

function Options({ room }: props) {

    const socket = useContext<ExtendedSocket>(socketContext);

    return (
        <div className="card bg-dark">
            <div>
                <h3>Composition ({room?.roles.length} / {room?.players.length})</h3>
                {
                    room?.roles?.length === 0
                        ? <p>Aucun rôle</p>
                        : <div className="d-inline">
                            {room?.roles?.map((role) => (
                                <span>{role}, </span>
                            ))}
                        </div>
                }
            </div>
            <div>
                <h3>Options de la partie</h3>
                <p className="fst-italic">En cours de débug</p>
            </div>
            {
                socket.id === room?.author &&
                <div>
                    {
                        room?.players?.length === room?.roles?.length
                            ? <button className="btn w-50 m-auto btn-success btn-lg my-3" onClick={() => { socket.emit('inGame') }}>Lancer la partie</button>
                            : <button className="btn w-50 m-auto btn-success btn-lg my-3" disabled>Lancer la partie</button>
                    }
                </div>
            }
        </div>
    )
}

export default Options;