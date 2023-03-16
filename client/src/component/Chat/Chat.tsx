import { useState, useContext } from "react"
import { socketContext, ExtendedSocket} from "../../context/socket"
import Message from "../Message/Message";
import "./Chat.css";

interface messages {
    messages?: string[],
    night: boolean
}

function Chat(props: messages) {

    const [input, setInput] = useState<string>("");

    const socket = useContext<ExtendedSocket>(socketContext);

    const sendMessage = () => {
        if (input !== "" && input.length < 120) {
            socket.emit('setMessage', input)
            setInput("");
        }
    }
    
    return (
        <div>
            <div id="containerMessages" className="d-flex align-items-start flex-column">
                {props.messages?.map((msg, index: number) => (
                    <Message 
                        msg={msg}
                        key={index} />
                ))}
            </div>
            {
                props.night === false
                ? <div>
                    <input type="text" onChange={ (e) => setInput(e.target.value)} value={input} max={150} min={1} placeholder={"Message..."} id="inputChat" className="mt-5 form-control" />
                    <button onClick={sendMessage} className="btn btn-primary mx-1">Envoyer</button>
                </div>
                : <div>
                <input type="text" disabled max={150} min={1} placeholder={"Impossible d'écrire pendant la nuit..."} id="inputChat" className="mt-5 form-control" />
                <button disabled className="btn btn-primary mx-1">Envoyer</button>
                </div>
            }

        </div>
    )
}

export default Chat;