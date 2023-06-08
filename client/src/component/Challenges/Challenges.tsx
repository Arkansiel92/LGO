import { challengeUsers } from "../../screen/Profil/Profil";
import s from "./Challenges.module.css";

function Challenges({challenge, step, isFinished}: challengeUsers) {
    return (
        <div className="my-3">
            <div className="fw-bold">{challenge.description}</div>
            <div className="text-muted">
                Rôle(s) concerné(s) : 
                {challenge.role.map((r, index) => (
                        <span key={index}> {r.name}, </span>
                ))}
            </div>
            <div className="progress" role="progressbar" aria-label="Basic example" aria-valuenow={step} aria-valuemin={0} aria-valuemax={challenge.goal}>
                <div className={`progress-bar ${isFinished && "bg-success"}`} style={{ width: step ===  0 ? "0%" : step / challenge.goal * 100 + "%" }}>{step} / {challenge.goal}</div>
            </div>
            <div style={{fontSize: "13px"}}>Titre : <span style={{color: challenge.title.color}}>{challenge.title.title}</span></div>
        </div>
    )
}

export default Challenges;