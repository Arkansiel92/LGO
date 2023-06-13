import { room } from "../../screen/Game/Game_old";
import { useContext } from "react";
import { socketContext } from "../../context/socket";
import "./Options.css";

interface props {
    room: room | null
}

function Options({ room }: props) {

    const socket = useContext(socketContext);

    const handleSubmit = (option: string, bool: boolean) => {
        socket.emit('setOptions', {option: option, bool: bool});
    }

    return (
        <div className="card bg-dark box-shadow">
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
            <div id="option-game">
                <h3>Options de la partie</h3>
                <p onClick={() => {handleSubmit("mayor", !room?.options.mayor)}}>Maire : {room?.options.mayor ? <span className="text-success">Activé</span> : <span className="text-danger">Désactivé</span>}</p>
                <p onClick={() => {handleSubmit("parkRanger", !room?.options.parkRanger)}}>Garde-champêtre : {room?.options.parkRanger ? <span className="text-success">Activé</span> : <span className="text-danger">Désactivé</span>}</p>
                <p className="text-muted">Evènement aléatoire : {room?.options.events ? <span className="text-success">Activé</span> : <span className="text-danger">Désactivé</span>} (soon)</p>
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