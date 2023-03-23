import { action } from "../Gameboard/Gameboard";
import "./Action.css";


function Action(props: any) {

    return (
        <div id="action" className="bg-dark card text-center w-50 m-auto position-absolute">
            <div className="card-header">
                {props?.name}
            </div>
            <div className="card-body">
                {props?.descriptionInGame}
            </div>
            {
                props?.response &&
                <div className="card-footer">
                    <button className="btn btn-danger mx-5">Non</button>
                    <button className="btn btn-success mx-5">Oui</button>
                </div>
            }
        </div>
    )
}

export default Action;