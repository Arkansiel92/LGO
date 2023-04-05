import { useContext } from "react";
import { socketContext, ExtendedSocket} from "../../context/socket"
import { message } from "../../screen/Game/Game";
import "./Message.css";

interface props {
    msg: message,
    loved: boolean | undefined,
    sister: boolean | undefined
}

function Message(props: props) {
    const socket = useContext<ExtendedSocket>(socketContext);

    return (
        <div>
            {/* {
                !props.msg.sister && !props.msg.loved && !props.sister && !props.loved ?
                <div>
                    {
                        props.msg.author !== "server" && props.msg.recipient === null && !props.msg.isDead &&
                        <div className="message-container chat px-4">
                            <span className="author fw-bold">{props.msg.author}</span> 
                            <div className="message">{props.msg.msg}</div>
                        </div>
                    }
                    {
                        props.msg.author === "server" &&  <div className="message-container server m-2 py-2 px-4"><i>{props.msg.msg}</i></div>
                    }
                    {
                        props.msg.recipient === socket.id && <div className="message-container role m-2 py-2 px-4"><i>{props.msg.msg}</i></div>
                    }
                    {
                        props.msg.isDead && props.msg.author !== "server" && 
                        <div className="message-container chat px-4">
                            <span className="author-dead fw-bold">{props.msg.author}</span> 
                            <div className="dead">{props.msg.msg}</div>
                        </div>
                    }
                </div>
                :
                <div>
                    {
                        props.msg.sister && props.sister && 
                        <div className="message-container chat px-4">
                            <span className="author fw-bold">{props.msg.author}</span> 
                            <div className="message">{props.msg.msg}</div>
                        </div>
                    }
                    {
                        props.msg.loved && props.loved && 
                        <div className="message-container chat px-4">
                            <span className="author fw-bold">{props.msg.author}</span> 
                            <div className="message">{props.msg.msg}</div>
                        </div>
                    }
                </div>
            } */}
            {
                (props.msg.recipient === socket.id || props.msg.recipient === null) &&
                <div className={`message-container ${props.msg.type} px-4`}>
                    {
                        props.msg.type === "chat" && <span className="author fw-bold">{props.msg.author}</span> 
                    }
                    <div className="message d-flex align-items-center">
                        {
                            props.msg.type === "join" && <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" height="17" width="17"><g><circle cx="5" cy="2.75" r="2.25" fill="none" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round"></circle><path d="M4.5,12.5H.5V11A4.51,4.51,0,0,1,7,7" fill="none" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round"></path><line x1="10.5" y1="7.5" x2="10.5" y2="13.5" fill="none" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round"></line><line x1="7.5" y1="10.5" x2="13.5" y2="10.5" fill="none" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round"></line></g></svg>
                        }
                        {
                            props.msg.type === "server" && <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" height="14" width="14"><g><circle cx="7" cy="7" r="6.5" fill="none" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round"></circle><line x1="7" y1="7" x2="7" y2="10.5" fill="none" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round"></line><circle cx="7" cy="4.5" r="0.5" fill="none" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round"></circle></g></svg>
                        }
                        {
                            props.msg.type === "vote" && <svg viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg" height="17" width="17"><path d="M.5,12.5C3.423,10.027,4.142,9,7,9H8.5v3l5-5.5-5-5v3h-1C2.5,4.5,1.5,9.5.5,12.5Z" fill="none" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                        }
                        {
                            props.msg.type === "role" && <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" height="17" width="17"><polygon points="8 0.5 8 5.5 11.5 5.5 6 13.5 6 8.5 2.5 8.5 8 0.5" fill="none" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round"></polygon></svg>
                        }
                        {
                            props.msg.type === "love" && <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" height="17" width="17"><g><path d="M.58,4.31C1.09,1.85,4.12,0,7,3.27c4.11-4.71,8.5,1.13,5.52,4.14L7,12.5l-3.23-3" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round"></path><polyline points="0.5 7 3 7 4.5 5 6.5 8.5 8 6.5 9.5 6.5" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round"></polyline></g></svg>
                        }
                        <span className="mx-2">{props.msg.msg}</span>
                    </div>
                </div>
            }
        </div>

    )
}

export default Message;