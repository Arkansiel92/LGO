import { useContext } from "react";
import { user } from "../../screen/Leaderboard/Leaderboard";
import { AuthContext } from "../../context/auth";


function RankPlayer({ index, username, points, win, loose }: user) {

    const auth = useContext(AuthContext);

    return (
        <tr className={auth.authState.user?.username === username ? "text-danger" : ""}>
            <th scope="row">{index}</th>
            <td>{username}</td>
            <td>{points}</td>
            <td>{win}</td>
            <td>{loose}</td>
        </tr>
    )
}

export default RankPlayer;