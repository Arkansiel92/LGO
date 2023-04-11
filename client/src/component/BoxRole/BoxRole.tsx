import { useContext, useState } from "react";
import { ExtendedSocket, socketContext } from "../../context/socket";
import Counter from "../Counter/Counter";
import "./BoxRole.css";
import Event, { event } from "../Event/Event";
import Actor from "../Actor/Actor";
import { roles } from "../../screen/Game/Game";

interface boxRole {
    description: string | undefined
    role: string | undefined
    victim: string | null | undefined
    name_function: string | undefined
    health?: boolean
    death?: boolean
    setYes?: boolean
    setNo?: boolean
    textarea?: boolean
    eventsGypsy?: event[]
    actor?: roles[]
}

function BoxRole({description, victim, name_function, health, death, setYes, setNo, eventsGypsy, actor, textarea}: boxRole) {

    const socket = useContext<ExtendedSocket>(socketContext);
    const [textareaInput, setTextareaInput] = useState("");

    const mayor = () => {
        if (textareaInput !== "") {
            socket.emit('setMayor', textareaInput);
        }
    }

    return (
        <div id="boxDialog" className="bg-dark card text-center lead p-3 m-auto">
            <div className="card-header">
                <Counter />
            </div>
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
                        setNo &&
                        <div onClick={() => {socket.emit('set' + name_function, false)}} className="action-box">
                            <span>{setNo}</span>
                        </div>
                    }
                    {
                        setYes &&
                        <div onClick={() => {socket.emit('set' + name_function, true)}} className="action-box">
                            <span>{setYes}</span>
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
                            <textarea name="" id="" className="form-control" value={textareaInput} placeholder="essayez de convaincre le village." onChange={(e) => { setTextareaInput(e.target.value) }} cols={60} rows={5}></textarea>
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
        </div>
    )
}

export default BoxRole;