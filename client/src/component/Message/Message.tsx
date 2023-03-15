import { useContext } from "react";
import { socketContext, ExtendedSocket} from "../../context/socket"
import "./Message.css";

interface message {
    msg: any
}

function Message(props: message) {

    const socket = useContext<ExtendedSocket>(socketContext);

    return (
        <div>
            {
                props.msg.author !== "MJ"
                ? <div id="message" className="myMessage m-2 py-2 px-4">
                    {props.msg.author} : {props.msg.msg}
                </div>
                : <div id="message" className="otherMessage m-2 py-2 px-4">
                    <i>{props.msg.msg}</i>
                </div>
            }
        </div>

    )
}

export default Message;