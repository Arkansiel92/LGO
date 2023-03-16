import { useContext } from "react";
import { socketContext, ExtendedSocket} from "../../context/socket"
import "./Message.css";

interface message {
    socket: string
    author: string,
    recipient: string,
    msg: string
}

interface props {
    msg: any 
}

function Message(props: props) {

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