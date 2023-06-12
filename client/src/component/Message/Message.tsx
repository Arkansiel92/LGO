import { useContext } from "react";
import { socketContext,  } from "../../context/socket"
import { message } from "../../screen/Game/Game";
import "./Message.css";

interface props {
    msg: message,
    loved: boolean | undefined,
    sister: boolean | undefined,
    selfIsDead: boolean | undefined
    selfRole: string | undefined
}

function Message(props: props) {
    
    const socket = useContext(socketContext);

    return (
        <div>
            {
                (props.sister === false && props.loved === false && props.msg.type !== "love" && props.msg.type !== "sister") &&
                <div>
                    {
                        ((props.msg.recipient === socket.id && !props.msg.isDead) || (props.msg.recipient === null && !props.msg.isDead)) &&
                        <div className={`message-container ${props.msg.type} px-4`}>
                            {
                                props.msg.author && <span className="author fw-bold">{props.msg.author}</span>
                            }
                            <div className={`message row align-items-center`}>
                                {
                                    props.msg.type !== "chat" &&
                                    <div className="col-1">
                                        {
                                            props.msg.type === "eventParkRanger" && <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" height="17" width="17"><g><path d="M7.36,13.43h0a1,1,0,0,1-.72,0h0a9.67,9.67,0,0,1-6.14-9V1.5a1,1,0,0,1,1-1h11a1,1,0,0,1,1,1V4.42A9.67,9.67,0,0,1,7.36,13.43Z" fill="none" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round"></path><rect x="4.5" y="5.5" width="5" height="4" rx="1" fill="none" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round"></rect><path d="M8.5,5.5v-1a1.5,1.5,0,1,0-3,0v1" fill="none" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round"></path></g></svg>
                                        }
                                        {
                                            props.msg.type === "join" && <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" height="17" width="17"><g><circle cx="5" cy="2.75" r="2.25" fill="none" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round"></circle><path d="M4.5,12.5H.5V11A4.51,4.51,0,0,1,7,7" fill="none" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round"></path><line x1="10.5" y1="7.5" x2="10.5" y2="13.5" fill="none" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round"></line><line x1="7.5" y1="10.5" x2="13.5" y2="10.5" fill="none" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round"></line></g></svg>
                                        }
                                        {
                                            props.msg.type === "leave" && <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" height="17" width="17"><g><circle cx="5" cy="3.75" r="2.25" fill="none" stroke="#fefefe" strokeLinecap="round" strokeLinejoin="round"></circle><path d="M6.5,13.5H.5V12A4.5,4.5,0,0,1,7.89,8.55" fill="none" stroke="#fefefe" strokeLinecap="round" strokeLinejoin="round"></path><line x1="8.5" y1="11.5" x2="13.5" y2="11.5" fill="none" stroke="#fefefe" strokeLinecap="round" strokeLinejoin="round"></line></g></svg>
                                        }
                                        {
                                            props.msg.type === "server" && <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" height="17" width="17"><g><circle cx="7" cy="7" r="6.5" fill="none" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round"></circle><line x1="7" y1="7" x2="7" y2="10.5" fill="none" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round"></line><circle cx="7" cy="4.5" r="0.5" fill="none" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round"></circle></g></svg>
                                        }
                                        {
                                            props.msg.type === "vote" && <svg viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg" height="17" width="17"><path d="M.5,12.5C3.423,10.027,4.142,9,7,9H8.5v3l5-5.5-5-5v3h-1C2.5,4.5,1.5,9.5.5,12.5Z" fill="none" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                                        }
                                        {
                                            props.msg.type === "role" && <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" height="17" width="17"><polygon points="8 0.5 8 5.5 11.5 5.5 6 13.5 6 8.5 2.5 8.5 8 0.5" fill="none" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round"></polygon></svg>
                                        }
                                        {
                                            props.msg.type === "death" && <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" height="17" width="17"><g><path d="M13,6.5a6,6,0,1,0-9.5,4.87V12.5a1,1,0,0,0,1,1h5a1,1,0,0,0,1-1V11.37A6,6,0,0,0,13,6.5Z" fill="none" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round"></path><circle cx="4.5" cy="7" r="0.5" fill="none" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round"></circle><circle cx="9.5" cy="7" r="0.5" fill="none" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round"></circle><line x1="6" y1="11.5" x2="6" y2="13.5" fill="none" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round"></line><line x1="8" y1="11.5" x2="8" y2="13.5" fill="none" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round"></line></g></svg>
                                        }
                                    </div>
                                }
                                <div className="col">
                                    <span className="mx-1">{props.msg.msg}</span>
                                </div>
                            </div>
                        </div>
                    }
                    {
                        (props.msg.isDead) &&
                        <div>
                            {
                                (props.selfIsDead || props.selfRole === "Nécromancien") &&
                                <div className={`message-container ${props.msg.type} text-muted px-4`}>
                                    <span className="author fw-bold">{props.msg.author}</span>
                                    <div>
                                        <span className="mx-1">{props.msg.msg}</span>
                                    </div>
                                </div>
                            }
                        </div>
                    }
                </div>
            }
            {
                (props.loved && props.msg.type === "love") &&
                <div className={`message-container ${props.msg.type} px-4`}>
                    <div className="message d-flex align-items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" height="17" width="17"><g><path d="M.58,4.31C1.09,1.85,4.12,0,7,3.27c4.11-4.71,8.5,1.13,5.52,4.14L7,12.5l-3.23-3" fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round"></path><polyline points="0.5 7 3 7 4.5 5 6.5 8.5 8 6.5 9.5 6.5" fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round"></polyline></g></svg>
                        <span className="mx-2">{props.msg.msg}</span>
                    </div>
                </div>
            }
            {
                (props.sister && props.msg.type === "sister") &&
                <div className={`message-container ${props.msg.type} px-4`}>
                    {
                        props.msg.author && <span className="author fw-bold">{props.msg.author}</span>
                    }
                    <div>
                        <span className="mx-2">{props.msg.msg}</span>
                    </div>
                </div>
            }
        </div>

    )
}

export default Message;