
import {socketContext, ExtendedSocket} from "../../context/socket";
import { useContext } from "react";
import "./Role.css";

interface role {
    name: string,
    name_function: string,
    description: string,
    side: string,
    max: number,
    img: string,
    roleArray: string[] | undefined,
    author: string | undefined,
    inGame: boolean,
    key: number
}

function Role({name, name_function, description, side, max, img, roleArray, author, inGame, key}: role) {

    const socket = useContext<ExtendedSocket>(socketContext);

    const nbRole = roleArray?.filter((role) => {
        return role === name
    }).length

    function setRole(name: string) {

        if (nbRole !== max) {
            socket.emit('addRole', name);
        } else {
            socket.emit('deleteRole', name);
        }
    }

    function addRole(name: string) {
        socket.emit('addRole', name);
    }

    function deleteRole(name: string) {
        socket.emit('deleteRole', name);
    }
    
    return (
        <div className={`p-2 my-4 mx-1 ${side} row`}>
            <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex">
                    <h4 className="fw-bold">{name}</h4>
                    <span className="mx-1" data-bs-toggle="collapse" data-bs-target={`#description-${name_function}`} role="button" aria-expanded="false" aria-controls={`description-${name_function}`}>?</span>
                </div>
                <img src={"/assets/img/role/" + img} width={35} alt="" />
            </div>
            <div className="collapse" id={`description-${name_function}`}>
                <div className="card-body lead">
                    {description}
                </div>
            </div>
            { 
                    name === "Villageois" || name === "Loup-garou"
                    ? <div>
                        <div>
                            {
                                author === socket.id && <button className=" m-1 btn-add" onClick={() => {addRole(name)}}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" height="15" width="15"><path d="M13.5,6.5a1,1,0,0,0-1-1h-4v-4a1,1,0,0,0-1-1h-1a1,1,0,0,0-1,1v4h-4a1,1,0,0,0-1,1v1a1,1,0,0,0,1,1h4v4a1,1,0,0,0,1,1h1a1,1,0,0,0,1-1v-4h4a1,1,0,0,0,1-1Z" fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round"></path></svg>    
                                </button>   
                            }
                            {
                                author === socket.id && <button className="m-1 btn-delete" onClick={() => {deleteRole(name)}}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" height="15" width="15"><path d="M13.19,3.05a1.06,1.06,0,0,0,0-1.49L12.44.81A1.06,1.06,0,0,0,11,.81L7,4.76,3.05.81a1.06,1.06,0,0,0-1.49,0l-.75.75a1.06,1.06,0,0,0,0,1.49l4,4L.81,11a1.06,1.06,0,0,0,0,1.49l.75.75a1.06,1.06,0,0,0,1.49,0L7,9.24,11,13.19a1.06,1.06,0,0,0,1.49,0l.75-.75a1.06,1.06,0,0,0,0-1.49L9.24,7Z" fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                                </button>
                            }

                        </div>
                    </div>
                    : <div>
                        {
                            author === socket.id && 
                            <div>
                                <button className={`mx-1 btn-role-${nbRole}`} onClick={() => {setRole(name)}}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" height="15" width="15"><path d="M13.5,6.5a1,1,0,0,0-1-1h-4v-4a1,1,0,0,0-1-1h-1a1,1,0,0,0-1,1v4h-4a1,1,0,0,0-1,1v1a1,1,0,0,0,1,1h4v4a1,1,0,0,0,1,1h1a1,1,0,0,0,1-1v-4h4a1,1,0,0,0,1-1Z" fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round"></path></svg>    
                                </button>
                            </div>
                        }
                    </div>
                }
            
            {/* {
                inGame === false
                ? <div className={`card-circle ${side}` } >

                    <img className="card-svg" src={"/assets/img/role/" + img} width={50} alt="" />
                { 
                    name === "Villageois" || name === "Loup-garou"
                    ? <div className="div-btn">
                        <div>
                            {
                                author === socket.id && <button className=" m-1 btn-add" onClick={() => {addRole(name)}}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" height="15" width="15"><path d="M13.5,6.5a1,1,0,0,0-1-1h-4v-4a1,1,0,0,0-1-1h-1a1,1,0,0,0-1,1v4h-4a1,1,0,0,0-1,1v1a1,1,0,0,0,1,1h4v4a1,1,0,0,0,1,1h1a1,1,0,0,0,1-1v-4h4a1,1,0,0,0,1-1Z" fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round"></path></svg>    
                                </button>   
                            }
                            {
                                author === socket.id && <button className="m-1 btn-delete" onClick={() => {deleteRole(name)}}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" height="15" width="15"><path d="M13.19,3.05a1.06,1.06,0,0,0,0-1.49L12.44.81A1.06,1.06,0,0,0,11,.81L7,4.76,3.05.81a1.06,1.06,0,0,0-1.49,0l-.75.75a1.06,1.06,0,0,0,0,1.49l4,4L.81,11a1.06,1.06,0,0,0,0,1.49l.75.75a1.06,1.06,0,0,0,1.49,0L7,9.24,11,13.19a1.06,1.06,0,0,0,1.49,0l.75-.75a1.06,1.06,0,0,0,0-1.49L9.24,7Z" fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                                </button>
                            }

                        </div>
                    </div>
                    : <div className="div-btn-role">
                        {
                            author === socket.id && 
                            <div>
                                <button className={`mx-1 btn-role-${nbRole}`} onClick={() => {setRole(name)}}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" height="15" width="15"><path d="M13.5,6.5a1,1,0,0,0-1-1h-4v-4a1,1,0,0,0-1-1h-1a1,1,0,0,0-1,1v4h-4a1,1,0,0,0-1,1v1a1,1,0,0,0,1,1h4v4a1,1,0,0,0,1,1h1a1,1,0,0,0,1-1v-4h4a1,1,0,0,0,1-1Z" fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round"></path></svg>    
                                </button>
                            </div>
                        }
                    </div>
                }
    
            </div>
                : <div className={`card-circle ${side}` }>
                    <img className="card-svg" src={"/assets/img/role/" + img} width={50} alt="" />
                </div>
            } */}
        </div>
    )
}

export default Role;