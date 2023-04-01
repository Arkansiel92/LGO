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
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" height="15" width="15"><g><path d="M10.5,3.5a3.5,3.5,0,0,1-7,0V.5h7Z" fill="none" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round"></path><path d="M10.5,10.5a3.5,3.5,0,0,0-7,0v3h7Z" fill="none" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round"></path><line x1="1.5" y1="0.5" x2="12.5" y2="0.5" fill="none" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round"></line><line x1="1.5" y1="13.5" x2="12.5" y2="13.5" fill="none" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round"></line></g></svg>
            <span className="mx-1">{time > 0 ? time : 0}</span>
        </div>
    )
}

export default Counter;