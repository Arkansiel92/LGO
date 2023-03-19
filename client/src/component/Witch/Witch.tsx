import { useContext } from 'react';
import { socketContext, ExtendedSocket} from "../../context/socket";
import "./Witch.css";

interface props {
    vote: string | null
}

function Witch({vote}: props) {

    const socket = useContext<ExtendedSocket>(socketContext);

    function sendWitch(choice: boolean) {
        socket.emit('setWitchChoice', choice);
    }

    return (
        <div className="my-3">
            <h4 className="text-center">Sorcière</h4>
            {
                vote !== null
                ? <p>{vote} est mort cette nuit, veux-tu utiliser ta potion de vie ou de mort ?</p>
                : <p>Personne n'est mort cette nuit. Veux-tu utiliser ta potion de mort ?</p>
            }
            <div className="d-flex justify-content-around">
                <button onClick={() => {sendWitch(false)}} className="btn btn-danger">Potion de mort</button>
                {vote !== null && <button onClick={() => {sendWitch(true)}} className="btn btn-success">Potion de résurrection</button>}    
            </div>   
        </div>
    )
}

export default Witch;