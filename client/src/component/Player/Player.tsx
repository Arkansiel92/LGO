import { roles } from '../../screen/Game/Game';
import './Player.css';

interface props {
    name: string,
    socket: string,
    role: roles | null,
    isDead: boolean,
    isTurn: boolean,
    isPower: boolean,
    isCouple: boolean,
    night: boolean,
    key: number
}

function Player(props: props) {
    return (
        <div>
            {props.name}
            {
                props.night === false && <button className='btn btn-success'>Voter pour {props.name}</button>
            }
        </div>
    )
}

export default Player;