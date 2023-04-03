import { useContext } from "react";
import { ExtendedSocket, socketContext } from "../../context/socket";
import Counter from "../Counter/Counter";
import "./BoxRole.css";
import Event, { event } from "../Event/Event";
import Actor from "../Actor/Actor";
import { roles } from "../../screen/Game/Game";

interface boxRole {
    description: string
    role: string
    victim: string | null
    name_function: string | undefined
    health?: boolean
    death?: boolean
    setYes?: boolean
    setNo?: boolean
    eventsGypsy?: event[]
    actor?: roles[]
}

function BoxRole({description, victim, name_function, health, death, setYes, setNo, eventsGypsy, actor}: boxRole) {

    const socket = useContext<ExtendedSocket>(socketContext);

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