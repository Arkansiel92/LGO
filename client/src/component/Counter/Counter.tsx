import { socketContext, ExtendedSocket} from "../../context/socket";
import { useContext, useState } from 'react';
import './Counter.css';

function Counter() {

    const socket = useContext<ExtendedSocket>(socketContext);
    const [time, setTime] = useState<number>(0);

    socket.on('counter', (time) => {
        setTime(time);
    })

    return (
        <div className="d-flex align-items-center justify-content-center">
            <span className="hourglass">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" height="17" width="17"><g><circle cx="7" cy="7" r="6.5" fill="none" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round"></circle><polyline points="7 4.5 7 7 9.54 9.96" fill="none" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round"></polyline></g></svg>
            </span>
            <span className="mx-1">{time > 0 ? time : 0}</span>
        </div>
    )
}

export default Counter;