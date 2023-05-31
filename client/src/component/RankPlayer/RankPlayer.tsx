import { user } from "../../screen/Leaderboard/Leaderboard";


function RankPlayer({index, username, points, win, loose}: user) {
    return (
        <div className="row">
            <div className="col">
                {index}
            </div>
            <div className="col">
                {username}
            </div>
            <div className="col">
                {points}
            </div>
            <div className="col">
                {win}
            </div>
            <div className="col">
                {loose}
            </div>
        </div>
    )
}

export default RankPlayer;