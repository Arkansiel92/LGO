import { useState, useContext } from "react";
import { socketContext, ExtendedSocket} from "../../context/socket";
import "./Dictator.css";

function Dictator() {

    const socket = useContext<ExtendedSocket>(socketContext);

    function sendDictator(bool: boolean) {
        socket.emit('setDictator', bool);
    }

    return (
        <div className="my-3">
            <h4 className="text-center">Coup d'Etat</h4>
            <p>Voulez-vous faire un coup d'état pour le prochain jour ?</p>
            <div className="d-flex justify-content-around">
                <button onClick={() => {sendDictator(false)}} className="btn btn-danger">Non</button>
                <button onClick={() => {sendDictator(true)}} className="btn btn-success">Oui</button>    
            </div>            
        </div>
    )
}

export default Dictator;