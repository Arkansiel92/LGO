import { useContext, useState } from "react";
import { socketContext } from "../../context/socket";
import EventGypsy, { eventGypsy } from "../EventGypsy/EventGypsy";
import Actor from "../Actor/Actor";
import { roles } from "../../screen/Game/Game";
import "./BoxRole.css";
import EventParkRanger, { eventParkRanger } from "../EventParkRanger/EventParkRanger";

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
    doNothing: boolean | undefined
    eventsGypsy?: eventGypsy[]
    eventsParkRanger?: eventParkRanger[]
    actor?: roles[]
}

function BoxRole({description, victim, name_function, type, title, health, death, setYes, setNo, eventsGypsy, eventsParkRanger, actor, textarea, doNothing}: boxRole) {

    const socket = useContext(socketContext);
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
        <div id="boxDialog" className="bg-dark card text-center lead m-auto box-shadow">
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
                        eventsGypsy.map((event: eventGypsy) => (
                            <EventGypsy name={event.name} description={event.description} />
                        ))
                    }
                    {
                        eventsParkRanger &&
                        eventsParkRanger.map((event: eventParkRanger) => (
                            <EventParkRanger name={event.name} description={event.description} />
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
            {/* {
                doNothing &&
                <div className="card-footer">
                    <button onClick={() => {handleSubmit(false)}} className="btn btn-lg btn-secondary">Ne rien faire</button>
                </div>
            } */}
        </div>
    )
}

export default BoxRole;