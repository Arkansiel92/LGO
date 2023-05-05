import { socketContext, ExtendedSocket} from "../../context/socket";
import { useContext, useEffect, useState } from 'react';
import './Counter.css';
import useSound from "use-sound";

function Counter() {

    const socket = useContext<ExtendedSocket>(socketContext);
    const [time, setTime] = useState<number>(0);
    const [timerSound, { stop }] = useSound("assets/sounds/timer.ogg", { volume: 0.10 });

    socket.on('counter', (time) => {
        setTime(time);
    })

    useEffect(() => {
        if (time < 10) {
            stop();

            return timerSound();
        }
        
    }, [time])

    return (
        <h3 className="d-flex align-items-center justify-content-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" height="20" width="20"><g><circle cx="7" cy="7" r="6.5" fill="none" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round"></circle><polyline points="7 4.5 7 7 9.54 9.96" fill="none" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round"></polyline></g></svg>
            <span className="mx-1">{time > 0 ? time : 0}</span>
        </h3>
    )
}

export default Counter;