import { useContext } from 'react';
import { socketContext, } from "../../context/socket";
import "./EventParkRanger.css";

export interface eventParkRanger {
    name: string,
    description: string,
}

function EventParkRanger({name, description}: eventParkRanger) {

    const socket = useContext(socketContext);

    return (
        <div className='eventParkRanger' onClick={() => {socket.emit('setEventParkRanger', name)}}>
            <h3>{name}</h3>
            <p>{description}</p>
        </div>
    )
}

export default EventParkRanger;