import { useState, useContext, useEffect } from "react"
import { socketContext, ExtendedSocket} from "../../context/socket"
import { message } from "../../screen/Game/Game";
import Message from "../Message/Message";
import "./Chat.css";



interface messages {
    messages?: message[],
    night: boolean | undefined
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
                        key={index} />
                ))}
            </div>
            {
                props.night === false
                ? <div>
                    <input type="text" onChange={ (e) => setInput(e.target.value) } value={input} max={150} min={1} placeholder={"Message au village..."} id="inputChat" className="mt-5 form-control" />
                </div>
                : <div>
                <input type="text" disabled max={150} min={1} placeholder={"Impossible d'écrire pendant la nuit..."} id="inputChat" className="mt-5 form-control" />
                </div>
            }

        </div>
    )
}

export default Chat;