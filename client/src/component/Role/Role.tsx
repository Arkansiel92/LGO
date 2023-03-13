
import {socketContext, ExtendedSocket} from "../../context/socket";
import { useContext } from "react";

interface role {
    name: string,
    description: string,
    side: string,
    max: number,
    img: string,
    roleArray: string[] | undefined,
    author: string | undefined
}

function Role({name, description, side, max, img, roleArray, author}: role) {

    console.log(img);

    const nbRole = roleArray?.filter((role) => {
        return role === name
    }).length

    const socket = useContext<ExtendedSocket>(socketContext);

    function addRole(name: string) {
        socket.emit('addRole', name);
    }

    function deleteRole(name: string) {
        socket.emit('deleteRole', name);
    }
    
    return (
        <div className="card-game text-center" style={{backgroundImage:`url(/assets/img/card/${img})`}}>
                <p data-bs-toggle="tooltip" data-bs-placement="top" title={description}>
                {name} ({nbRole})
                </p>
                {
                    socket.id === author &&
                    <div className="">
                        <button className="btn btn-danger mx-1" onClick={() => {deleteRole(name)}}>-</button>
                        <button className="btn btn-success mx-1" onClick={() => {addRole(name)}}>+</button>            
                    </div>
                }
          </div>
    )
}

export default Role;