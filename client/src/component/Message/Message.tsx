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
            {
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
            }

        </div>

    )
}

export default Message;