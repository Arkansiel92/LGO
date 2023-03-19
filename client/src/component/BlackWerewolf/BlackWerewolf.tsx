import { useContext } from 'react';
import { socketContext, ExtendedSocket} from "../../context/socket";
import "./BlackWerewolf.css";

interface props {
    vote: string | null
}

function BlackWerewolf({vote}: props) {

    const socket = useContext<ExtendedSocket>(socketContext);

    function sendBlackWerewolf(choice: boolean) {
        socket.emit('setBlackWerewolf', choice);
    }

    return (
        <div>
        { 
            vote !== null &&
            <div className="my-3">
                <h4 className="text-center">Loup noir</h4>
                <p>{vote} est mort cette nuit, veux-tu l'infecter ?</p>
                <div className="d-flex justify-content-around">
                    <button onClick={() => {sendBlackWerewolf(false)}} className="btn btn-danger">Non</button>
                    <button onClick={() => {sendBlackWerewolf(true)}} className="btn btn-success">Oui</button>    
                </div>
            </div>
        }
        </div>

    )
}

export default BlackWerewolf; 