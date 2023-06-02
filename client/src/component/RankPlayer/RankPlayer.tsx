import { useContext } from "react";
import { user } from "../../screen/Leaderboard/Leaderboard";
import { AuthContext } from "../../context/auth";


function RankPlayer({index, username, points, win, loose}: user) {

    const auth = useContext(AuthContext);

    return (
        <div className={auth.authState.user?.username === username ? "row text-danger" : "row" }>
            <div className="col">
                <p>{index}</p>
            </div>
            <div className="col">
                <p>{username}</p>
            </div>
            <div className="col">
                <p>{points}</p>
            </div>
            <div className="col">
                <p>{win}</p>
            </div>
            <div className="col">
                <p>{loose}</p>
            </div>
        </div>
    )
}

export default RankPlayer;