import { useState, useContext } from "react";
import { roles } from "../../screen/Game/Game";
import Actor from "../Actor/Actor";
import Event, { event } from "../Event/Event";
import { action } from "../Gameboard/Gameboard";
import { socketContext, ExtendedSocket} from "../../context/socket";
import "./Action.css";


function Action({name, name_function, descriptionInGame, response, victim, actorRoles, gypsy}: action) {

    const socket = useContext<ExtendedSocket>(socketContext);
    
    const [animation, setAnimation] = useState("action");

    function sendToRole(bool: boolean) {
        if (name !== "Sorcière") {
            socket.emit('set' + name_function, bool);
        } else {
            socket.emit('setWitchChoice', bool);
        }
    }

    return (
        <div id={`${animation}`} className="bg-dark card text-center">
            <div className="card-header">
                <h3>{name}</h3>
            </div>
            <div className="card-body lead">
                {
                    victim && <p>{victim} est mort cette nuit.</p>
                }
                <p>{descriptionInGame}</p>
                {
                    actorRoles &&
                    <div className="row">
                        {
                            actorRoles.map((role: roles, index: number) => (
                                <Actor role={role} key={index} />
                            ))
                        }
                    </div>
                }
                {
                    gypsy &&
                    <div className="row">
                        {
                            gypsy.map((event: event) => (
                                <Event name={event.name} description={event.description} />
                            ))
                        }
                    </div>
                }
            </div>
            {
                response &&
                <div className="card-footer">
                    <button onClick={() => {sendToRole(false)}} className="btn btn-danger mx-5">{name !== "Sorcière" ? "Non" : "Non, tuez quelqu'un"}</button>
                    <button onClick={() => {sendToRole(true)}} className="btn btn-success mx-5">{name !== "Sorcière" ? "Oui" : "Oui, sauver la personne"}</button>
                </div>
            }
        </div>
    )
}

export default Action;