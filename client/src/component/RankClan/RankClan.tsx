import { useContext } from "react";
import { AuthContext } from "../../context/auth";
import { useNavigate } from "react-router-dom";
import { rank, user } from "../../screen/Clan/InfoClan/InfoClan";

interface props {
    user: user
    rank: rank
}

function RankClan({ user, rank }: props) {

    const auth = useContext(AuthContext);
    const navigate = useNavigate();

    return (
        <div className="row">
            <div className="col-sm-6">
                <p className="left-click" onClick={() => { navigate('/profil/' + user.id) }}>{user.username} ({user.points}pts)</p>
            </div>
            <div className="col-sm-3">
                <p className="text-muted">{rank.name}</p>
            </div>
            {
                (user.id === auth.authState.user?.id && rank.level !== 5) &&
                <div className="col-sm-3">
                    <button className="btn btn-outline-danger">Quitter le clan</button>
                </div>
            }
            {
                (rank.level >= 4 && user.id !== auth.authState.user?.id) &&
                <div className="col-sm-3">
                    <button className="btn btn-outline-danger">Virer du clan</button>
                </div>
            }
        </div>
    )
}

export default RankClan;