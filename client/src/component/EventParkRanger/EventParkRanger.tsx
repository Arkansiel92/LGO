import { useContext } from 'react';
import { socketContext, ExtendedSocket} from "../../context/socket";
import "./EventParkRanger.css";

export interface eventParkRanger {
    name: string,
    description: string,
}

function EventParkRanger({name, description}: eventParkRanger) {

    const socket = useContext<ExtendedSocket>(socketContext);

    return (
        <div className='eventParkRanger' onClick={() => {socket.emit('setEventParkRanger', name)}}>
            <h3>{name}</h3>
            <p>{description}</p>
        </div>
    )
}

export default EventParkRanger;