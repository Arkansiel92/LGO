
import {socketContext, ExtendedSocket} from "../../context/socket";
import { useContext } from "react";
import "./Role.css";

interface role {
    name: string,
    description: string,
    side: string,
    max: number,
    img: string,
    roleArray: string[] | undefined,
    author: string | undefined,
    ready: boolean
}

function Role({name, description, side, max, img, roleArray, author, ready}: role) {

    const socket = useContext<ExtendedSocket>(socketContext);

    const nbRole = roleArray?.filter((role) => {
        return role === name
    }).length

    function addRole(name: string) {
        socket.emit('addRole', name);
    }

    function deleteRole(name: string) {
        socket.emit('deleteRole', name);
    }
    
    return (
        <div className={`col-sm-3 `} data-bs-toggle="tooltip" data-bs-placement="top" title={name + " : " + description}>
            {
                ready === false
                ? <div className={`card-circle`} style={{backgroundImage:`url(/assets/img/card/${img})`}} >
                { 
                    name === "Simple villageois" || name === "Loup-garou"
                    ? <div>
                        <div className="">
                            <button className="mx-1 btn-delete" onClick={() => {deleteRole(name)}}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" height="15" width="15"><path d="M13.19,3.05a1.06,1.06,0,0,0,0-1.49L12.44.81A1.06,1.06,0,0,0,11,.81L7,4.76,3.05.81a1.06,1.06,0,0,0-1.49,0l-.75.75a1.06,1.06,0,0,0,0,1.49l4,4L.81,11a1.06,1.06,0,0,0,0,1.49l.75.75a1.06,1.06,0,0,0,1.49,0L7,9.24,11,13.19a1.06,1.06,0,0,0,1.49,0l.75-.75a1.06,1.06,0,0,0,0-1.49L9.24,7Z" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                            </button>
                            <button className=" mx-1 btn-add" onClick={() => {addRole(name)}}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" height="15" width="15"><path d="M13.5,6.5a1,1,0,0,0-1-1h-4v-4a1,1,0,0,0-1-1h-1a1,1,0,0,0-1,1v4h-4a1,1,0,0,0-1,1v1a1,1,0,0,0,1,1h4v4a1,1,0,0,0,1,1h1a1,1,0,0,0,1-1v-4h4a1,1,0,0,0,1-1Z" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round"></path></svg>    
                            </button>            
                        </div>
                    </div>
                    : <div>
                        {
                            nbRole === max
                            ?   <button className="mx-1 btn-delete" onClick={() => {deleteRole(name)}}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" height="15" width="15"><path d="M13.19,3.05a1.06,1.06,0,0,0,0-1.49L12.44.81A1.06,1.06,0,0,0,11,.81L7,4.76,3.05.81a1.06,1.06,0,0,0-1.49,0l-.75.75a1.06,1.06,0,0,0,0,1.49l4,4L.81,11a1.06,1.06,0,0,0,0,1.49l.75.75a1.06,1.06,0,0,0,1.49,0L7,9.24,11,13.19a1.06,1.06,0,0,0,1.49,0l.75-.75a1.06,1.06,0,0,0,0-1.49L9.24,7Z" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                            </button>
                            :   <button className=" mx-1 btn-add" onClick={() => {addRole(name)}}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" height="15" width="15"><path d="M13.5,6.5a1,1,0,0,0-1-1h-4v-4a1,1,0,0,0-1-1h-1a1,1,0,0,0-1,1v4h-4a1,1,0,0,0-1,1v1a1,1,0,0,0,1,1h4v4a1,1,0,0,0,1,1h1a1,1,0,0,0,1-1v-4h4a1,1,0,0,0,1-1Z" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round"></path></svg>    
                            </button>   
                        }   
                    </div>
                }
    
            </div>
                : <div className={`card-circle`} style={{backgroundImage:`url(/assets/img/card/${img})`}}></div>
            }
        </div>
    )
}

export default Role;