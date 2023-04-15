import Navbar from "../../component/Navbar/Navbar";
import { useContext, useState, useEffect } from "react";
import "./Roles.css";
import { ExtendedSocket, socketContext } from "../../context/socket";
import { roles } from "../Game/Game";

function Roles() {

    const socket = useContext<ExtendedSocket>(socketContext);
    const [roles, setRoles] = useState<roles[] | null>(null);

    socket.on('getRoles', (roles) => {
        setRoles(roles);
        console.log(roles);
    })

    useEffect(() => {
        if (!roles) {
            socket.emit('getRoles');
        }
    }, [roles, socket])

    return (
        <div>
            <Navbar />
            <div className="my-3 container-fluid">
                <div className="align-items-center py-5 text-center">
                    <h1 className="display-5 fw-bold text-body-emphasis lh-1 mb-3">
                        Liste des rôles
                    </h1>
                    <p className="lead">La liste complète des rôles de Moonrise</p>
                </div>
                <div className="row">
                    <div className="col-3">
                        <h1>Rôle</h1>
                    </div>
                    <div className="col">
                        <h1>Description</h1>
                    </div>
                </div>
                {roles?.map((role: roles) => (
                    <div className={`row ${role.side} my-3`}>
                        <div className="col-3">
                            <h2>{role.name}</h2>
                        </div>
                        <div className="col">
                            <p className="lead">{role.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Roles;