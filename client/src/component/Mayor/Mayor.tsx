import "./Mayor.css";
import { mayor } from "../../screen/Game/Game";
import { ExtendedSocket, socketContext } from '../../context/socket';
import { useContext } from "react";

interface props {
    candidates: mayor[]
}

function Mayor({candidates}: props) {

    const socket = useContext<ExtendedSocket>(socketContext);

    function vote(player: string) {
        socket.emit("voteMayor", player);
    }

    return (
        <div className="text-center mt-5 d-flex w-100">
            {candidates.map((candid) => (
                <div onClick={() => vote(candid.name)} className="card-mayor card bg-dark m-auto">
                    <div>
                        <div className="card-header">
                            <h5>{candid.name} ({candid.votes.length})</h5>
                        </div>
                        <div className="card-body">
                            <p className="lead"><span className="fw-bold">Discours :</span> {candid.content}</p>
                            {
                                candid.votes.length === 0
                                ? <p>Aucun vote</p>
                                : candid.votes.map((player) => (
                                    <p>{player}</p>
                                    ))
                                }
                        </div>
                    </div>
                </div>
                ))}
        </div>
    )
}

export default Mayor;