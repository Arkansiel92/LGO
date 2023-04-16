import { useContext, useState } from "react";
import { ExtendedSocket, socketContext } from "../../context/socket";
import Event, { event } from "../Event/Event";
import Actor from "../Actor/Actor";
import { roles } from "../../screen/Game/Game";
import "./BoxRole.css";

interface boxRole {
    description: string | undefined
    role: string | undefined
    victim: string | null | undefined
    name_function: string | undefined
    type?: string
    title?: string
    health?: boolean
    death?: boolean
    setYes?: boolean
    setNo?: boolean
    textarea?: boolean
    eventsGypsy?: event[]
    actor?: roles[]
}

function BoxRole({description, victim, name_function, type, title, health, death, setYes, setNo, eventsGypsy, actor, textarea}: boxRole) {

    const socket = useContext<ExtendedSocket>(socketContext);
    const [textareaInput, setTextareaInput] = useState("");

    const mayor = () => {
        if (textareaInput !== "") {
            socket.emit('setMayor', textareaInput);
        }
    }

    function handleSubmit(bool: boolean) {
        if (type === "event") {
            return socket.emit('setRandomEvent', bool);
        }

        return socket.emit('set' + name_function, bool)
    }

    return (
        <div id="boxDialog" className="bg-dark card text-center lead m-auto">
            {
                title && 
                <div className="card-header">
                    <h2>{title}</h2>
                </div>
            }
            <div className="card-body">
                <p>{description}</p>
                {victim && <p><span className="fw-bold">{victim}</span> est mort cette nuit.</p>}
                <div className="d-flex justify-content-around">
                    {
                        death && 
                        <div onClick={() => {socket.emit('setWitchChoice', false)}} className="action-box">
                            <img src="assets/img/sprites/death-potion.svg" alt="" width={40} />
                        </div>
                    }
                    {
                        health && 
                        <div onClick={() => {socket.emit('setWitchChoice', true)}} className="action-box">
                            <img src="assets/img/sprites/health-potion.svg" alt="" width={40} />
                        </div>
                    }
                    {
                        setYes &&
                        <div onClick={() => {handleSubmit(true)}} className="action-box">
                            <span>{setYes}</span>
                        </div>
                    }
                    {
                        setNo &&
                        <div onClick={() => {handleSubmit(false)}} className="action-box">
                            <span>{setNo}</span>
                        </div>
                    }
                    {
                        eventsGypsy &&
                        eventsGypsy.map((event: event) => (
                            <Event name={event.name} description={event.description} />
                        ))
                    }
                    {
                        textarea &&
                        <div>
                            <textarea className="form-control" value={textareaInput} placeholder="essayez de convaincre le village." onChange={(e) => { setTextareaInput(e.target.value) }} cols={60} rows={5}></textarea>
                            <button onClick={mayor} className="btn btn-primary mt-2">Postuler</button>
                        </div>
                    }
                    {
                        actor &&
                        actor.map((role) => (
                            <Actor role={role} />
                        ))
                    }
                </div>
            </div>
            <div className="card-footer">
                <button onClick={() => {handleSubmit(false)}} className="btn btn-lg btn-secondary">Ne rien faire</button>
            </div>
        </div>
    )
}

export default BoxRole;