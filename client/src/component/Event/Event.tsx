import { useContext } from 'react';
import { socketContext, ExtendedSocket} from "../../context/socket";
import "./Event.css";

export interface event {
    name: string,
    description: string
}

function Event({name, description}: event) {

    const socket = useContext<ExtendedSocket>(socketContext);

    function sendGypsy(choice: string) {
        socket.emit('setGypsy', choice);
    }

    return (
        <div className='col event-gypsy' onClick={() => {sendGypsy(name)}}>
            <h3>{name}</h3>
            <p>{description}</p>
        </div>
    )
}

export default Event;