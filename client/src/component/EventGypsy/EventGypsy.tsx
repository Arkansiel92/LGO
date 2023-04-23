import { useContext } from 'react';
import { socketContext, ExtendedSocket} from "../../context/socket";
import "./EventGypsy.css";

export interface eventGypsy {
    name: string,
    description: string
}

function EventGypsy({name, description}: eventGypsy) {

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

export default EventGypsy;