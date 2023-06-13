import { player } from "../../screen/Game/Game_old";
import './Votes.css';


interface props {
    players: player[]
}

function Votes({players}: props) {
    return (
        <div className="mt-5" id="array-votes">
            <h1 className="text-center border-bottom">Tableau des votes</h1>
            <div className="row">
            {players.map((player) => (
                <div className="col-sm-6 text-center">
                    {
                        !player.isDead &&
                        <div>
                        <h4>{player.name} ({player.votes.length})</h4>
                        {
                            player.votes.length === 0 
                            ? <p className="fst-italic lh-1">Aucun vote</p>
                            : player.votes.map((vote) => (
                                <p className="lh-1">{vote}</p>
                            ))
                        }
                        </div>
                    }
                </div>
            ))}
            </div>
        </div>
    )
}

export default Votes;

