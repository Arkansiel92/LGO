import { player } from "../../screen/Game/Game";
import './Votes.css';


interface props {
    players: player[]
}

function Votes({players}: props) {
    return (
        <div className="card" id="array-votes">
            <div className="card-header">
                <h1>Tableau des votes</h1>
            </div>
            <div className="card-body">
                <div className="row">
                {players.map((player) => (
                    <div className="col">
                        <span>{player.name}</span>
                    </div>
                ))}
                </div>
            </div>
        </div>
    )
}

export default Votes;

