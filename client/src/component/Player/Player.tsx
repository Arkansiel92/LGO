import { socketContext, ExtendedSocket} from "../../context/socket";
import './Player.css';
import { useContext } from 'react';

interface props {
    name: string,
    name_function: string | undefined,
    socket: string,
    isDead: boolean,
    isTurn: boolean,
    isPower: boolean,
    isCouple: boolean,
    night: boolean,
    action: boolean,
    vote: boolean,
    key: number
}

function Player(props: props) {
    const socket = useContext<ExtendedSocket>(socketContext);

    function action(target: string) {
        socket.emit('set' + props.name_function, {targetID: target, userID: socket.id});
    }

    return (
        <div className='card bg-dark p-5'>
            {props.name}
            {
                props.vote && <button className='btn btn-success'>Voter pour {props.name}</button>
            }
            {
                props.action && <button onClick={() => {action(props.socket)}} className='btn btn-primary'>Selectionner</button>
            }
        </div>
    )
}

export default Player;