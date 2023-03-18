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
                props.msg.author !== "server" && props.msg.recipient === null && <div id="message" className="messageUser m-2 py-2 px-4">{props.msg.author} : {props.msg.msg}</div>
            }
            {
                props.msg.author === "server" &&  <div id="message" className="messageServer m-2 py-2 px-4"><i>{props.msg.msg}</i></div>
            }
            {
                props.msg.recipient === socket.id && <div id="message" className="messageRole m-2 py-2 px-4"><i>{props.msg.msg}</i></div>
            }
        </div>

    )
}

export default Message;