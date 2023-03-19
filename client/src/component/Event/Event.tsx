import { useContext } from 'react';
import { socketContext, ExtendedSocket} from "../../context/socket";
import { event } from '../Gypsy/Gypsy';
import "./Event.css";

function Event({name, description}: event) {

    const socket = useContext<ExtendedSocket>(socketContext);

    function sendGypsy(choice: string) {
        socket.emit('setGypsy', choice);
    }

    return (
        <div className='my-3'>
            <p><strong>{name}</strong> : {description}</p>
            <button onClick={() => {sendGypsy(name)}} className='btn btn-primary'>Choisir</button>
        </div>
    )
}

export default Event;