import { useState, useContext, useEffect } from "react"
import { socketContext, ExtendedSocket} from "../../context/socket"
import { message } from "../../screen/Game/Game";
import Message from "../Message/Message";
import "./Chat.css";

interface props {
    messages?: message[],
    loved: boolean | undefined,
    sister: boolean | undefined,
    night: boolean | undefined
}

function Chat(props: props) {

    const [input, setInput] = useState<string>("");
    const [sister, setSister] = useState<boolean>(false);
    const [lover, setLover] = useState<boolean>(false);

    const socket = useContext<ExtendedSocket>(socketContext);

    const sendMessage = () => {
        if (input !== "" && input.length < 120) {

            let type = null;

            if (sister) {
                type = "sister";
            } else if (lover) {
                type = "lover"
            } else {
                type = "chat";
            }

            socket.emit('setMessage', {msg: input, type: type })
            setInput("");
        }
    }

    useEffect(() => {
        const listener = (event: any) => {
            if (event.code === "Enter" || event.code === "NumpadEnter") {
                event.preventDefault();
                sendMessage();
            }
        };
        document.addEventListener("keydown", listener);
        return () => {
        document.removeEventListener("keydown", listener);
        };
    })
    
    return (
        <div>
            <div id="containerMessages" className="">
                {props.messages?.map((msg, index: number) => (
                    <Message 
                        msg={msg}
                        loved={lover}
                        sister={sister}
                        key={index} />
                ))}
            </div>
            {
                !props.night || sister || lover 
                ? <input type="text" onChange={ (e) => setInput(e.target.value) } value={input} max={150} min={1} placeholder={"Envoyez un message..."} className="mt-2" id="input-chat"/>
                : <input type="text" disabled max={150} min={1} placeholder={"Impossible d'écrire pendant la nuit..."} className="mt-2" id="input-chat"/>
            }
            {
                props.loved && 
                <div className="form-check form-switch">
                    <input className="form-check-input" onChange={() => {setLover(!lover)}} type="checkbox" id="flexSwitchCheckDefault" />
                </div>
            }
            {
                props.sister && 
                <div className="form-check form-switch">
                    <input className="form-check-input" onChange={() => {setSister(!sister)}} type="checkbox" id="flexSwitchCheckDefault" />
                </div>
            }
        </div>
    )
}

export default Chat;