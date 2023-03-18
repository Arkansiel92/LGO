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
        <div className="text-end">
            {time > 0 && time}
        </div>
    )
}

export default Counter;