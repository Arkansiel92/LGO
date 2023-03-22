import { player } from "../../screen/Game/Game";

interface props {
    player: player
}

function Card(props: props) {
    return (
        <div className="my-3">
            <div className="d-flex justify-content-around">
                <div>
                    Role : {props?.player.role?.name}
                </div>
                <div>
                    Statut : {props?.player.isDead ? "Mort" : "Vivant"}
                </div>
                <div>
                    Pouvoir : {!props?.player.isPlayed ? "actif" : "utilisé"}
                </div>
                <div>
                    Amoureux : {props?.player.isCouple ? "Amoureux" : "Célibataire"}
                </div>
            </div>
            
        </div>
    )
}

export default Card;