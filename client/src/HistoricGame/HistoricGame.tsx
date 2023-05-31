import { game } from "../screen/Profil/Profil";


function HistoricGame({role, isWon, createdAt}: game) {
    return (
        <div className="d-flex justify-content-between">
            <p>{role}</p>
            {
                isWon
                ? <p className="text-success">Gagné</p>
                : <p className="text-danger">Perdue</p>
            }
            <p className="text-muted">{new Date(createdAt).toLocaleDateString('fr')}</p>
        </div>
    )
}

export default HistoricGame;