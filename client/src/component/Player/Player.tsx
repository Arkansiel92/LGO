import './Player.css';

interface props {
    name: string,
    key: number
}

function Player(props: props) {
    return (
        <div>
            {props.name}
        </div>
    )
}

export default Player;