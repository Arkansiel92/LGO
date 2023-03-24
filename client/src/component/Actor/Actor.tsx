import { roles } from "../../screen/Game/Game";
import { socketContext, ExtendedSocket} from "../../context/socket"
import { useContext } from "react"


interface props {
    role: roles
}

function Actor({role}: props) {

    const socket = useContext<ExtendedSocket>(socketContext);

    function sendRole(role: roles) {
        socket.emit('setActor', role);
    }

    return (
        <div className="col">
            <p><strong>{role.name}</strong> : {role.description}</p>
            <button className="btn btn-primary mb-3" onClick={() => sendRole(role)}>Prendre le rôle</button>
        </div>
    )
}

export default Actor;