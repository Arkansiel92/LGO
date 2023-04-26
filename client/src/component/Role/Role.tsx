
import { socketContext, ExtendedSocket } from "../../context/socket";
import { useContext } from "react";
import useSound from 'use-sound'
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
    inGame: boolean | undefined
}

function Role({ name, name_function, description, side, max, img, roleArray, author, inGame }: role) {

    const socket = useContext<ExtendedSocket>(socketContext);
    const [addSound] = useSound("assets/sounds/add.wav");

    const nbRole = roleArray?.filter((role) => {
        return role === name
    }).length

    function setRole(name: string) {
        
        if (nbRole !== max) {
            addSound();
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
        <div className={`p-2 my-3 mx-1 ${side} row`}>
            <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex">
                    <h4 className="fw-bold">{name}</h4>
                    <span className="mx-1" data-bs-toggle="collapse" data-bs-target={`#description-${name_function}`} role="button" aria-expanded="false" aria-controls={`description-${name_function}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 48 48" height="17" width="17"><path fill="#ffffff" fillRule="evenodd" d="M24.0006 1.5C16.5853 1.5 11.3918 1.72845 8.1274 1.94597C4.87227 2.16288 2.26103 4.60273 1.9642 7.9036C1.72031 10.6158 1.48828 14.6518 1.48828 20.1919C1.48828 25.7321 1.72031 29.7681 1.9642 32.4802C2.26103 35.7811 4.87227 38.221 8.12739 38.4379C9.63194 38.5381 11.5462 38.6407 13.8988 38.7222V42.9193C13.8988 45.9405 17.4694 47.5423 19.726 45.5335L27.2125 38.869C32.9422 38.815 37.1029 38.6225 39.8739 38.4379C43.129 38.221 45.7402 35.7811 46.0371 32.4803C46.2809 29.7681 46.513 25.7321 46.513 20.1919C46.513 14.6518 46.281 10.6158 46.0371 7.9036C45.7402 4.60273 43.129 2.16288 39.8739 1.94598C36.6094 1.72845 31.416 1.5 24.0006 1.5ZM23.2362 27.333C21.8094 27.333 20.6528 28.4896 20.6528 29.9164C20.6528 31.3431 21.8094 32.4998 23.2362 32.4998C24.663 32.4998 25.8196 31.3431 25.8196 29.9164C25.8196 28.4896 24.663 27.333 23.2362 27.333ZM18.1164 12.1979C18.3853 11.1247 19.259 9.9503 20.6945 9.02073C22.1111 8.10336 23.9687 7.5 25.9946 7.5C28.4561 7.5 30.0678 8.36465 31.0837 9.53523C32.1296 10.7405 32.6613 12.409 32.6613 14.1668C32.6613 15.9532 32.02 17.1893 30.8945 18.282C29.6913 19.4502 27.9686 20.4246 25.7878 21.5952C25.301 21.8565 24.9972 22.3643 24.9972 22.9168V23.333C24.9972 23.8853 24.5495 24.333 23.9972 24.333H21.8764C21.3236 24.333 20.8756 23.8844 20.8764 23.3316L20.8806 20.3113C20.8806 19.6363 21.397 18.8207 22.6944 17.8532C23.6747 17.1222 24.8097 16.5116 25.8702 15.941C26.1609 15.7847 26.446 15.6313 26.7207 15.4793C27.4363 15.0834 27.7029 14.1873 27.3201 13.4647C26.9374 12.742 26.0463 12.4591 25.3168 12.8286C24.0014 13.4948 22.3498 14.4577 21.397 15.0238C20.92 15.3073 20.6008 15.4239 20.3509 15.4375C19.4456 15.4868 18.8231 15.1311 18.4516 14.6189C18.0634 14.0838 17.8556 13.2392 18.1164 12.1979Z" clipRule="evenodd"></path></svg>
                    </span>
                </div>
                <img src={"/assets/img/role/" + img} width={35} alt="" />
            </div>
            <div className="collapse" id={`description-${name_function}`}>
                <div className="card-body lead">
                    {description}
                </div>
            </div>
            {
                !inGame &&
                <div>
                    {
                        name === "Villageois" || name === "Loup-garou"
                            ? <div className="d-flex">
                                <div>
                                    {
                                        author === socket.id && <button className=" m-1 btn-add" onClick={() => { addRole(name) }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" height="15" width="15"><path d="M13.5,6.5a1,1,0,0,0-1-1h-4v-4a1,1,0,0,0-1-1h-1a1,1,0,0,0-1,1v4h-4a1,1,0,0,0-1,1v1a1,1,0,0,0,1,1h4v4a1,1,0,0,0,1,1h1a1,1,0,0,0,1-1v-4h4a1,1,0,0,0,1-1Z" fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                                        </button>
                                    }
                                    {
                                        author === socket.id && <button className="m-1 btn-delete" onClick={() => { deleteRole(name) }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" height="15" width="15"><path d="M13.19,3.05a1.06,1.06,0,0,0,0-1.49L12.44.81A1.06,1.06,0,0,0,11,.81L7,4.76,3.05.81a1.06,1.06,0,0,0-1.49,0l-.75.75a1.06,1.06,0,0,0,0,1.49l4,4L.81,11a1.06,1.06,0,0,0,0,1.49l.75.75a1.06,1.06,0,0,0,1.49,0L7,9.24,11,13.19a1.06,1.06,0,0,0,1.49,0l.75-.75a1.06,1.06,0,0,0,0-1.49L9.24,7Z" fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                                        </button>
                                    }

                                </div>
                            </div>
                            : <div>
                                {
                                    author === socket.id &&
                                    <div className="form-check form-switch">
                                        <input onClick={() => { setRole(name) }} className="form-check-input" type="checkbox" id="flexSwitchCheckDefault"></input>
                                    </div>
                                }
                            </div>
                    }
                </div>
            }
        </div>
    )
}

export default Role;