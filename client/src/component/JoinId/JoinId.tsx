import s from "./Join.module.css";

function JoinId({id}: {id : string | undefined}) {
    return (
        <div className={s.join} onClick={() => { navigator.clipboard.writeText(window.location.origin + "/game/join/" + id) }}>
            {window.location.origin}/game/join/{id}
        </div>
    )
}

export default JoinId;