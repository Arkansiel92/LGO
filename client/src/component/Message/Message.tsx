import { useContext } from "react";
import { socketContext, ExtendedSocket} from "../../context/socket"
import { message } from "../../screen/Game/Game";
import "./Message.css";

interface props {
    msg: message
}

function Message(props: props) {
    const socket = useContext<ExtendedSocket>(socketContext);

    return (
        <div>
            {
                props.msg.author !== "server" && props.msg.recipient === null && 
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
        </div>

    )
}

export default Message;