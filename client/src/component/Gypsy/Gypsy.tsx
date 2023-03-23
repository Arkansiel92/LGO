import { useContext, useState, useEffect } from 'react';
import { socketContext, ExtendedSocket} from "../../context/socket";
import Event from '../Event/Event';
import "./Gypsy.css";

export interface event {
    name: string,
    description: string
}

function Gypsy() {

    const socket = useContext<ExtendedSocket>(socketContext);
    const [events, setEvents] = useState([]);

    socket.on('setEvents', events => {
        setEvents(events);
    })

    useEffect(() => {
        if (!events.length) {
            socket.emit('getEvents');
        }
    }, [events, socket])

    return (
        <div>
            <h4 className="text-center">l'évènement des gitans</h4>
            <p>Voulez-vous déclencher un évènement pour la prochaine journée</p>
            <div className="d-flex justify-content-around">
                {events.map((event: event) => (
                    <Event name={event.name} description={event.description} />
                ))}
            </div>  
        </div>
    )
}
export default Gypsy;