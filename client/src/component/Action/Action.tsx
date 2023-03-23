import { action } from "../Gameboard/Gameboard";
import "./Action.css";


function Action({name, descriptionInGame, response}: action) {

    return (
        <div id="action" className="bg-dark card text-center w-50 m-auto position-absolute">
            <div className="card-header">
                <h3>{name}</h3>
            </div>
            <div className="card-body lead">
                {descriptionInGame}
            </div>
            {
                response &&
                <div className="card-footer">
                    <button className="btn btn-danger mx-5">Non</button>
                    <button className="btn btn-success mx-5">Oui</button>
                </div>
            }
        </div>
    )
}

export default Action;