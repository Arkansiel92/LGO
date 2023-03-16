import { player } from "../../screen/Game/Game";

interface props {
    player: player
}

function Card(props: props) {
    return (
        <div className="bg-dark">
            <div className="d-flex justify-content-around">
                <div>
                    Role : {props?.player.role?.name}
                </div>
                <div>
                    Statut : {props?.player.isDead ? "Mort" : "Vivant"}
                </div>
                <div>
                    Amoureux : {props?.player.isCouple ? "Amoureux" : "Célibataire"}
                </div>
            </div>
            
        </div>
    )
}

export default Card;